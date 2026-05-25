import { NavLink } from 'react-router-dom';
import {
    Home,
    Users,
    Settings,
    Calendar,
    Clock,
    ClipboardList,
    BookOpen,
    Building,
    FileText,
    Car
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    // ACA !!! OJO: Definición de todos los ítems y qué roles pueden verlos
    const allMenuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['Admin', 'Secretario'] },
        { path: '/administracion', label: 'Administración', icon: Users, badge: 2, roles: ['Admin'] },
        { path: '/configuracion', label: 'Configuración', icon: Settings, badge: 1, roles: ['Admin'] },
        { path: '/planificacion', label: 'Planificación', icon: Calendar, badge: 1, roles: ['Admin', 'Secretario'] },
        { path: '/horarios', label: 'Horarios', icon: Clock, badge: 1, roles: ['Admin', 'Profesor', 'Alumno', 'Secretario'] },
        { path: '/evaluaciones', label: 'Evaluaciones', icon: ClipboardList, badge: 4, roles: ['Admin', 'Profesor', 'Alumno'] },
        { path: '/clases', label: 'Clases', icon: BookOpen, badge: 7, roles: ['Admin', 'Profesor', 'Alumno'] },
        { path: '/salas', label: 'Salas', icon: Building, badge: 6, roles: ['Admin', 'Secretario'] },
        { path: '/solicitudes', label: 'Solicitudes', icon: FileText, badge: 3, roles: ['Admin', 'Secretario', 'Alumno', 'Usuario'] },
    ];

   
    const menuItems = allMenuItems.filter(item => {
        if (!user) return false;
        const userRole = user.rol || user.role || '';
        return item.roles.includes(userRole);
    });

    return (
        <aside className="platform-sidebar">
            <div className="platform-sidebar-logo">
                <div className="icon-container">
                    <Car size={24} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>AutoEscuela Pro</h2>
                    <span style={{ fontSize: '0.75rem', color: '#a0a5b8' }}>Sistema de Gestión</span>
                </div>
            </div>
            <nav className="platform-sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `platform-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon className="icon" />
                            {item.label}
                            {item.badge && <span className="platform-nav-badge">{item.badge}</span>}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
