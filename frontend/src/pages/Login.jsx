import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const result = await login(correo, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="auth-container">
            <div className="card-glass auth-form">
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ color: 'var(--color-primary)', fontSize: '2rem' }}>Bienvenido</h2>
                    <p style={{ color: 'var(--color-text-light)' }}>Ingresa tus credenciales para continuar</p>
                </div>

                {error && <div className="error-msg" style={{ textAlign: 'center', background: 'rgba(229, 115, 115, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-main)' }}>Correo Electrónico</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="tu@correo.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-main)' }}>Contraseña</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
                        {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem' }}>
                    ¿No tienes una cuenta? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
