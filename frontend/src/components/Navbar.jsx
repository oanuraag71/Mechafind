import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import logoMark from '../assets/mechafind-logo.svg';

const guestLinks = [{ to: '/login', label: 'Login', type: 'link' }, { to: '/register', label: 'Register', type: 'primary' }];
const userLinks = {
  mechanic: [{ to: '/mechanic/dashboard', label: 'Dashboard' }],
  user: [
    { to: '/mechanics', label: 'Mechanics' },
    { to: '/dashboard', label: 'Requests' },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path));
  const links = user ? userLinks[user.role] || [] : guestLinks;

  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link to="/" className="brand-mark" onClick={closeMenu}>
          <img src={logoMark} alt="MechaFind logo" className="brand-logo-image" />
          <span className="brand-text">
            <strong>MechaFind</strong>
            <small>Roadside support</small>
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
          <Link className={isActive('/') ? 'nav-link active' : 'nav-link'} to="/" onClick={closeMenu}>
            Home
          </Link>

          {links.map(({ to, label, type = 'link' }) => (
            <Link
              key={to}
              className={type === 'primary' ? 'btn-primary nav-action-button' : isActive(to) ? 'nav-link active' : 'nav-link'}
              to={to}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <>
              <button type="button" className="btn-outline nav-action-button" onClick={() => { logout(); closeMenu(); }}>
                Logout
              </button>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
