import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LoaderCircle, UserRound, Wrench } from 'lucide-react';
import { AuthIntro, FormField } from '../components/ui';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      navigate(data.user.role === 'mechanic' ? '/mechanic/dashboard' : '/dashboard');
    } catch {
      setError('Unable to create the account right now.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <AuthIntro
        kicker="Create account"
        title="Join as a driver or mechanic."
        description="Pick your role once, create the account, and continue to the dashboard that matches your workflow."
      />

      <section className="auth-panel card">
        <span className="section-kicker">Register</span>
        <h2>Start with MechaFind</h2>

        <div className="role-toggle">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'user' })}
            className={form.role === 'user' ? 'role-option active' : 'role-option'}
          >
            <UserRound size={16} />
            Driver
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

        <form onSubmit={handleSubmit} className="stack-md">
          <FormField
            id="register-name"
            label="Full name"
            type="text"
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />

          <FormField
            id="register-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />

          <FormField id="register-password" label="Password">
            <div className="password-field">
              <input
                id="register-password"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
              <button type="button" className="icon-button" onClick={() => setShowPwd((current) => !current)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <LoaderCircle size={18} className="spin-forever" /> : 'Create account'}
          </button>
        </form>

        <p className="auth-switch-copy">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}
