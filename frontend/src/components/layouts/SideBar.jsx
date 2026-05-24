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

    // Definición de todos los ítems y qué roles pueden verlos
    const allMenuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'profesor', 'alumno', 'secretaria'] },
        { path: '/administracion', label: 'Administración', icon: Users, badge: 2, roles: ['admin'] },
        { path: '/configuracion', label: 'Configuración', icon: Settings, badge: 1, roles: ['admin'] },
        { path: '/planificacion', label: 'Planificación', icon: Calendar, badge: 1, roles: ['admin', 'secretaria'] },
        { path: '/horarios', label: 'Horarios', icon: Clock, badge: 1, roles: ['admin', 'profesor', 'alumno', 'secretaria'] },
        { path: '/evaluaciones', label: 'Evaluaciones', icon: ClipboardList, badge: 4, roles: ['admin', 'profesor', 'alumno'] },
        { path: '/clases', label: 'Clases', icon: BookOpen, badge: 7, roles: ['admin', 'profesor', 'alumno'] },
        { path: '/salas', label: 'Salas', icon: Building, badge: 6, roles: ['admin', 'secretaria'] },
        { path: '/solicitudes', label: 'Solicitudes', icon: FileText, badge: 3, roles: ['admin', 'secretaria', 'alumno'] },
    ];

    // Filtramos el menú para que solo se muestren los que incluyen el rol del usuario
    const menuItems = allMenuItems.filter(item => {
        if (!user) return false;
        const userRole = user.rol?.toLowerCase() || '';
        const normalizedRole = userRole === 'administrador' ? 'admin' : userRole;
        return item.roles.includes(normalizedRole);
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
