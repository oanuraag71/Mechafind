import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const MechanicsPage = lazy(() => import('./pages/MechanicsPage'));
const MechanicProfile = lazy(() => import('./pages/MechanicProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MechanicDashboard = lazy(() => import('./pages/MechanicDashboard'));

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <div className="route-loader-mark" />
      <p>Loading premium experience...</p>
    </div>
  );
}

// Page transition wrapper
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  return (
    <div className="app-container">
      {/* 2px scroll progress bar at the top */}
      <motion.div className="scroll-progress" style={{ scaleX, width: '100%' }} />
      
      <Navbar />
      
      <div className="main-content">
        <Suspense fallback={<RouteLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
              <Route path="/mechanics" element={<PrivateRoute><PageWrapper><MechanicsPage /></PageWrapper></PrivateRoute>} />
              <Route path="/mechanics/:id" element={<PrivateRoute><PageWrapper><MechanicProfile /></PageWrapper></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>} />
              <Route path="/mechanic/dashboard" element={<PrivateRoute><PageWrapper><MechanicDashboard /></PageWrapper></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
