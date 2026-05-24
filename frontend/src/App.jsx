import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/login';
import Register from './pages/register';

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

// Componente para proteger rutas según rol
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles) {
    const userRoleRaw = user.rol || user.role || '';
    const userRole = String(userRoleRaw).toLowerCase();
    
    // Normalizamos variaciones de administrador
    const isManager = ['admin', 'administrador', 'admins'].includes(userRole);
    const normalizedUserRole = isManager ? 'admin' : userRole;
    
    if (!allowedRoles.includes(normalizedUserRole)) {
      // Para evitar un loop infinito si falla en el mismo dashboard
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

// Componente para redirigir si ya está logueado
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
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
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'profesor', 'alumno', 'secretaria', 'usuario']}><Dashboard /></ProtectedRoute>} />
            <Route path="/administracion" element={<ProtectedRoute allowedRoles={['admin']}><Administracion /></ProtectedRoute>} />
            <Route path="/configuracion" element={<ProtectedRoute allowedRoles={['admin']}><Configuracion /></ProtectedRoute>} />
            <Route path="/planificacion" element={<ProtectedRoute allowedRoles={['admin', 'secretaria']}><Planificacion /></ProtectedRoute>} />
            <Route path="/horarios" element={<ProtectedRoute allowedRoles={['admin', 'profesor', 'alumno', 'secretaria']}><Horarios /></ProtectedRoute>} />
            <Route path="/evaluaciones" element={<ProtectedRoute allowedRoles={['admin', 'profesor', 'alumno']}><Evaluaciones /></ProtectedRoute>} />
            <Route path="/clases" element={<ProtectedRoute allowedRoles={['admin', 'profesor', 'alumno']}><Clases /></ProtectedRoute>} />
            <Route path="/salas" element={<ProtectedRoute allowedRoles={['admin', 'secretaria']}><Salas /></ProtectedRoute>} />
            <Route path="/solicitudes" element={<ProtectedRoute allowedRoles={['admin', 'secretaria', 'alumno']}><Solicitudes /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
