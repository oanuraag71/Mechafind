import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, Moon, SunMedium, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoMark from '../assets/mechafind-logo.svg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHidden(latest > lastY && latest > 120);
    setLastY(latest);
  });

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('mechafind-theme');
    const resolvedTheme =
      savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(resolvedTheme);
    document.documentElement.dataset.theme = resolvedTheme;
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem('mechafind-theme', nextTheme);
  };

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-110%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="site-nav"
    >
      <div className="site-nav-inner">
        <Link to="/" className="brand-mark">
          <span className="brand-icon brand-icon-image-shell">
            <img src={logoMark} alt="MechaFind logo" className="brand-logo-image" />
          </span>
          <span className="brand-text">
            <strong>MechaFind</strong>
            <small>premium roadside care</small>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className={menuOpen ? 'nav-links mobile-open' : 'nav-links'}>
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>

          <Link className={isActive('/') ? 'nav-link active' : 'nav-link'} to="/">
            Home
          </Link>

          {user ? (
            <>
              {user.role === 'mechanic' ? (
                <Link
                  className={isActive('/mechanic/dashboard') ? 'nav-link active' : 'nav-link'}
                  to="/mechanic/dashboard"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    className={isActive('/mechanics') ? 'nav-link active' : 'nav-link'}
                    to="/mechanics"
                  >
                    Find Mechanics
                  </Link>
                  <Link
                    className={isActive('/dashboard') ? 'nav-link active' : 'nav-link'}
                    to="/dashboard"
                  >
                    My Requests
                  </Link>
                </>
              )}

              <button onClick={logout} className="btn-outline nav-action-button" type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={isActive('/login') ? 'nav-link active' : 'nav-link'} to="/login">
                Login
              </Link>
              <Link to="/register" className="btn-primary nav-action-button">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
