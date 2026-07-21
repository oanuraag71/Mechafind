import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { AuthIntro, FormField } from '../components/ui';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate(data.user.role === 'mechanic' ? '/mechanic/dashboard' : '/dashboard');
    } catch {
      setError('Unable to sign in. Please check your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <AuthIntro
        kicker="Welcome back"
        title="Sign in to manage your requests."
        description="Drivers can track service requests. Mechanics can respond to active jobs and chat with customers."
      />

      <section className="auth-panel card">
        <span className="section-kicker">Login</span>
        <h2>Access your account</h2>

        <form onSubmit={handleSubmit} className="stack-md">
          <FormField
            id="login-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />

          <FormField id="login-password" label="Password">
            <div className="password-field">
              <input
                id="login-password"
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
            {loading ? <LoaderCircle size={18} className="spin-forever" /> : 'Login'}
          </button>
        </form>

        <p className="auth-switch-copy">
          Do not have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </div>
  );
}
