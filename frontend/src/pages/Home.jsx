import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>Plataforma de Estudio</h2>
                <p style={{ margin: '1rem 0' }}>Por favor inicia sesión para continuar</p>
                <button className="btn-primary" onClick={() => navigate('/login')} style={{ width: 'auto' }}>Ir a Login</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                    <h1 style={{ color: 'var(--color-primary)' }}>Dashboard Principal</h1>
                    <p style={{ color: 'var(--color-text-light)' }}>Bienvenido, {user.nombre}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ background: 'var(--color-accent)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                        Rol: {user.rol}
                    </span>
                    <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--color-error)', color: 'var(--color-error)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card-glass" style={{ padding: '2rem' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Siguiente Fase</h3>
                    <p style={{ color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                        ESTAMOS TRABAJANDO PARA USTED  ({user.rol}).
                        <br /><br />
                        PAGINA EN PROCESO DE CONSTRUCCIÓN - GRACIAS POR SU PACIENCIA.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
