import { GraduationCap, Calendar, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>Bienvenido, {user?.nombre}</h2>
                <p>Vista general de tu panel de {user?.rol}</p>
            </div>

            <div className="platform-dashboard-grid">
                <div className="platform-stat-card">
                    <div className="platform-stat-header">
                        <span className="platform-stat-title">Total Alumnos</span>
                        <div className="platform-stat-icon-wrapper" style={{ backgroundColor: 'rgba(77, 182, 172, 0.2)' }}>
                            <GraduationCap size={20} color="var(--color-primary)" />
                        </div>
                    </div>
                    <div className="platform-stat-value">248</div>
                    <div className="platform-stat-trend trend-up">↗ +12% este mes</div>
                </div>

                <div className="platform-stat-card">
                    <div className="platform-stat-header">
                        <span className="platform-stat-title">Clases Programadas</span>
                        <div className="platform-stat-icon-wrapper" style={{ backgroundColor: 'rgba(255, 183, 77, 0.2)' }}>
                            <Calendar size={20} color="#FFB74D" />
                        </div>
                    </div>
                    <div className="platform-stat-value">156</div>
                    <div className="platform-stat-trend trend-up">↗ +8% esta semana</div>
                </div>

                <div className="platform-stat-card">
                    <div className="platform-stat-header">
                        <span className="platform-stat-title">Profesores Activos</span>
                        <div className="platform-stat-icon-wrapper" style={{ backgroundColor: 'rgba(129, 199, 132, 0.2)' }}>
                            <Users size={20} color="#81C784" />
                        </div>
                    </div>
                    <div className="platform-stat-value">18</div>
                    <div className="platform-stat-trend trend-neutral">→ Sin cambios</div>
                </div>

                <div className="platform-stat-card">
                    <div className="platform-stat-header">
                        <span className="platform-stat-title">Tasa de Aprobación</span>
                        <div className="platform-stat-icon-wrapper" style={{ backgroundColor: 'rgba(149, 117, 205, 0.2)' }}>
                            <CheckCircle size={20} color="#9575CD" />
                        </div>
                    </div>
                    <div className="platform-stat-value">87%</div>
                    <div className="platform-stat-trend trend-up">↗ +5% último trimestre</div>
                </div>
            </div>

            <div className="platform-table-card">
                <div className="platform-table-header">
                    <h3>Clases Recientes</h3>
                    {['Admin', 'Profesor'].includes(user?.rol) && (
                        <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>+ Nueva Clase</button>
                    )}
                </div>
                <table className="platform-table">
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            <th>Tipo</th>
                            <th>Profesor</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Juan Pérez</td>
                            <td>Práctica</td>
                            <td>María Silva</td>
                            <td>24/05/2026</td>
                            <td>10:00</td>
                            <td><span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Completada</span></td>
                        </tr>
                        <tr>
                            <td>Ana Gómez</td>
                            <td>Teórica</td>
                            <td>Carlos Ruiz</td>
                            <td>24/05/2026</td>
                            <td>11:30</td>
                            <td><span style={{ color: '#FFB74D', fontWeight: 600 }}>En curso</span></td>
                        </tr>
                        <tr>
                            <td>Luis Rojas</td>
                            <td>Práctica</td>
                            <td>María Silva</td>
                            <td>25/05/2026</td>
                            <td>09:00</td>
                            <td><span style={{ color: 'var(--color-text-light)', fontWeight: 600 }}>Programada</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
