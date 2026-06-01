import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';
import { Search, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    // Helper to format pathname to title
    const getPageTitle = (pathname) => {
        const path = pathname.split('/').pop();
        if (!path || path === '') return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    const title = getPageTitle(location.pathname);

    return (
        <div className="platform-container">
            <Sidebar />
            <div className="platform-main-content">
                <header className="platform-header">
                    <div className="platform-header-left">
                        <h1 className="platform-header-title">{title}</h1>
                        <span className="platform-header-breadcrumb">Inicio / {title}</span>
                    </div>
                    <div className="platform-header-right">
                        <div className="platform-search">
                            <Search size={18} color="var(--color-text-light)" />
                            <input type="text" placeholder="Buscar..." />
                        </div>
                        <div className="platform-user-profile">
                            <div className="platform-user-avatar">
                                {user?.nombre?.substring(0, 2).toUpperCase() || 'AD'}
                            </div>
                            <div className="platform-user-info">
                                <span className="platform-user-name">{user?.nombre || 'Admin Usuario'}</span>
                                <span className="platform-user-role" style={{ textTransform: 'capitalize' }}>{user?.rol || 'Administrador'}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-error)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Cerrar Sesión"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>
                <main className="platform-page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
