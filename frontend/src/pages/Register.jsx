import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        correo: '',
        password: '',
        confirmPassword: '',
        nombrecompleto: '',
        rut: '',
        direccion: '',
        localidad: '',
        edad: ''
    });

    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        // Validación básica frontend
        if (formData.password !== formData.confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }

        setIsSubmitting(true);

        const dataToSend = { ...formData };
        delete dataToSend.confirmPassword;
        dataToSend.edad = parseInt(dataToSend.edad);

        const result = await register(dataToSend);

        if (result.success) {
            setSuccessMsg('¡Registro exitoso! Redirigiendo al login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            setError(result.message);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="auth-container" style={{ padding: '2rem 0' }}>
            <div className="card-glass auth-form" style={{ maxWidth: '600px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ color: 'var(--color-primary)', fontSize: '2rem' }}>Crea tu Cuenta</h2>
                    <p style={{ color: 'var(--color-text-light)' }}>Únete a nuestra plataforma de estudio</p>
                </div>

                {error && <div className="error-msg" style={{ textAlign: 'center', background: 'rgba(229, 115, 115, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}
                {successMsg && <div style={{ textAlign: 'center', color: 'var(--color-primary)', background: 'rgba(77, 182, 172, 0.1)', padding: '0.5rem', borderRadius: '8px', fontWeight: 600 }}>{successMsg}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Nombre Completo</label>
                        <input type="text" name="nombrecompleto" className="input-field" placeholder="Ej. Juan Pérez" value={formData.nombrecompleto} onChange={handleChange} required />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>RUT</label>
                        <input type="text" name="rut" className="input-field" placeholder="12.345.678-9" value={formData.rut} onChange={handleChange} required />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Edad</label>
                        <input type="number" name="edad" className="input-field" placeholder="Mayor de 18" value={formData.edad} onChange={handleChange} required min="18" />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Correo (@gmail.com/cl)</label>
                        <input type="email" name="correo" className="input-field" placeholder="tu@gmail.com" value={formData.correo} onChange={handleChange} required />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Localidad</label>
                        <input type="text" name="localidad" className="input-field" placeholder="Ej. Santiago" value={formData.localidad} onChange={handleChange} required />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Dirección</label>
                        <input type="text" name="direccion" className="input-field" placeholder="Calle Ejemplo 123" value={formData.direccion} onChange={handleChange} required />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Contraseña</label>
                        <input type="password" name="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Confirmar Contraseña</label>
                        <input type="password" name="confirmPassword" className="input-field" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Registrando...' : 'Registrarme'}
                        </button>
                    </div>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem' }}>
                    ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;