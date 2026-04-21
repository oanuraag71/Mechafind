import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LoaderCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      nav(data.user.role === 'mechanic' ? '/mechanic/dashboard' : '/dashboard');
    } catch {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-media-panel">
        <div className="auth-media-overlay" />
        <div className="brand-scene scene-auth" aria-hidden="true">
          <div className="scene-backdrop" />
          <div className="scene-orbit orbit-a" />
          <div className="scene-arc" />
          <div className="scene-showcase-card scene-showcase-main">
            <span>Secure entry</span>
            <strong>Premium roadside access</strong>
          </div>
        </div>
        <div className="auth-media-copy">
          <span className="section-kicker">Premium access</span>
          <h1>Return to a more composed roadside assistance experience.</h1>
          <p>Sharper hierarchy, bespoke visual language, and calmer spacing give the product a more elevated first impression.</p>
          <div className="hero-trust-row">
            <div className="trust-badge">
              <ShieldCheck size={14} />
              Secure sign in
            </div>
            <div className="trust-badge">
              <Sparkles size={14} />
              Refined visual flow
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-panel">
        <motion.div
          className={`auth-form-card glass-card ${errorShake ? 'shake' : ''}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="section-kicker">Welcome back</span>
          <h2>Sign in to MechaFind</h2>
          <p className="auth-form-subtitle">Access your service dashboard, requests, and specialist activity in one place.</p>

          <form onSubmit={handleSubmit} className="flex-col">
            <div className="input-group">
              <input
                type="email"
                placeholder=" "
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <label>Email Address</label>
            </div>

            <div className="input-group password-group">
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder=" "
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <label>Password</label>
              <button type="button" className="password-toggle" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <LoaderCircle size={18} className="spin-forever" /> : 'Enter dashboard'}
            </button>
          </form>

          <p className="auth-switch-copy">
            Do not have an account? <Link to="/register">Register</Link>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
