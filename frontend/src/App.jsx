import { Suspense, createElement, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const MechanicsPage = lazy(() => import('./pages/MechanicsPage'));
const MechanicProfile = lazy(() => import('./pages/MechanicProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MechanicDashboard = lazy(() => import('./pages/MechanicDashboard'));

const protectedRoutes = [
  ['/mechanics', MechanicsPage],
  ['/mechanics/:id', MechanicProfile],
  ['/dashboard', Dashboard],
  ['/mechanic/dashboard', MechanicDashboard],
];

const publicRoutes = [
  ['/', HomePage],
  ['/login', LoginPage],
  ['/register', RegisterPage],
];

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RouteLoader() {
  return <div className="page-loader">Loading...</div>;
}

function AppRoutes() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-shell">
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {publicRoutes.map(([path, component]) => (
              <Route key={path} path={path} element={createElement(component)} />
            ))}
            {protectedRoutes.map(([path, component]) => (
              <Route key={path} path={path} element={<PrivateRoute>{createElement(component)}</PrivateRoute>} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
