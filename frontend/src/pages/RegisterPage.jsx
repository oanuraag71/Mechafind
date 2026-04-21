import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LoaderCircle, Sparkles, UserRound, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
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
        <div className="brand-scene scene-register" aria-hidden="true">
          <div className="scene-backdrop" />
          <div className="scene-orbit orbit-b" />
          <div className="scene-gridplane" />
          <div className="scene-showcase-card scene-showcase-main">
            <span>Join the network</span>
            <strong>Elite service starts here</strong>
          </div>
        </div>
        <div className="auth-media-copy">
          <span className="section-kicker">Join the network</span>
          <h1>Create your account through a sharper, more premium onboarding flow.</h1>
          <p>The signup journey now has clearer role selection, bespoke brand visuals, and stronger visual structure.</p>
        </div>
      </section>

      <section className="auth-form-panel">
        <motion.div
          className={`auth-form-card glass-card ${errorShake ? 'shake' : ''}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="section-kicker">Create account</span>
          <h2>Get started with MechaFind</h2>
          <p className="auth-form-subtitle">Choose whether you are requesting assistance or delivering it.</p>

          <div className="role-toggle">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'user' })}
              className={form.role === 'user' ? 'role-option active' : 'role-option'}
            >
              <UserRound size={16} />
              Vehicle owner
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'mechanic' })}
              className={form.role === 'mechanic' ? 'role-option active' : 'role-option'}
            >
              <Wrench size={16} />
              Mechanic
            </button>
          </div>

          <div className="selected-role-note">
            <Sparkles size={14} />
            Signing up as <strong>{form.role === 'user' ? 'Vehicle Owner' : 'Mechanic'}</strong>
          </div>

          <form onSubmit={handleSubmit} className="flex-col">
            <div className="input-group">
              <input
                type="text"
                placeholder=" "
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
              <label>Full Name</label>
            </div>

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
              {loading ? <LoaderCircle size={18} className="spin-forever" /> : 'Create membership'}
            </button>
          </form>

          <p className="auth-switch-copy">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
