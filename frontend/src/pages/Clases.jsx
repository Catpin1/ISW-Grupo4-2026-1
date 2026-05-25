import { useAuth } from '../context/AuthContext';

const Clases = () => {
    const { user } = useAuth();

    return (
        <div className="card-glass" style={{ padding: '2rem' }}>
            <h2 style={{ color: 'var(--color-primary)' }}>Módulo de Clases</h2>
            <p>Contenido en desarrollo...</p>

            {['Admin', 'Profesor'].includes(user?.rol) && (
                <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed var(--color-primary)' }}>
                    <strong>Acciones de Gestión:</strong> Solo visible para {user?.rol}. (Ej. Crear, Editar Clases)
                </div>
            )}
        </div>
    );
};
export default Clases;
