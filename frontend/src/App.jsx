import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// Main Layout & Pages
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Administracion from './pages/Administracion';
import Configuracion from './pages/Configuracion';
import Planificacion from './pages/Planificacion';
import Horarios from './pages/Horarios';
import Evaluaciones from './pages/Evaluaciones';
import Clases from './pages/Clases';
import Salas from './pages/Salas';
import Solicitudes from './pages/Solicitudes';
const getDefaultRouteByRole = (role) => {
  const defaultRoutes = {
    Admin: '/dashboard',
    Secretario: '/dashboard',
    Profesor: '/horarios',
    Alumno: '/horarios',
    Usuario: '/solicitudes',
  };

  return defaultRoutes[role] || '/login';
};

// Componente para proteger rutas según rol
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles) {
    const userRole = user.rol || user.role || '';
    
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={getDefaultRouteByRole(userRole)} replace />;
    }
  }
  
  return children;
};

// Componente para redirigir si ya está logueado
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (user) return <Navigate to={getDefaultRouteByRole(user.rol || user.role)} replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<GuestRoute><Navigate to="/login" replace /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          
          {/* Rutas de Plataforma */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'Secretario']}><Dashboard /></ProtectedRoute>} />
            <Route path="/administracion" element={<ProtectedRoute allowedRoles={['Admin']}><Administracion /></ProtectedRoute>} />
            <Route path="/configuracion" element={<ProtectedRoute allowedRoles={['Admin']}><Configuracion /></ProtectedRoute>} />
            <Route path="/planificacion" element={<ProtectedRoute allowedRoles={['Admin', 'Secretario']}><Planificacion /></ProtectedRoute>} />
            <Route path="/horarios" element={<ProtectedRoute allowedRoles={['Admin', 'Profesor', 'Alumno', 'Secretario']}><Horarios /></ProtectedRoute>} />
            <Route path="/evaluaciones" element={<ProtectedRoute allowedRoles={['Admin', 'Profesor', 'Alumno']}><Evaluaciones /></ProtectedRoute>} />
            <Route path="/clases" element={<ProtectedRoute allowedRoles={['Admin', 'Profesor', 'Alumno']}><Clases /></ProtectedRoute>} />
            <Route path="/salas" element={<ProtectedRoute allowedRoles={['Admin', 'Secretario']}><Salas /></ProtectedRoute>} />
            <Route path="/solicitudes" element={<ProtectedRoute allowedRoles={['Admin', 'Secretario', 'Alumno', 'Usuario']}><Solicitudes /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
