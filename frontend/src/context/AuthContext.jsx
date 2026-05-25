import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Interceptor para agregar el token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Si hay un token, asumimos que está logueado por ahora (se podría validar contra un endpoint /me)
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Si el usuario guardado tiene una propiedad "user" anidada (el bug anterior), lo reparamos
                if (parsedUser && parsedUser.user && parsedUser.token) {
                    setUser(parsedUser.user);
                    localStorage.setItem('user', JSON.stringify(parsedUser.user));
                } else {
                    setUser(parsedUser);
                }
            } catch (e) {
                console.error("Error parsing stored user", e);
            }
        }
        setLoading(false);
    }, []);

    const login = async (correo, password) => {
        try {
            const res = await api.post('/auth/login', { correo, password });

            // El backend devuelve: { success, message, data: { user, token } }
            const { user: userData, token } = res.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, user: userData };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al iniciar sesión'
            };
        }
    };

    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            return { success: true, data: res.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al registrar usuario',
                details: error.response?.data?.details || [] // Para detalles de Joi
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, api }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
