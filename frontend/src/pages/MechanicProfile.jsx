import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CarFront, CheckCircle, MapPin, Phone, ShieldCheck, Star } from 'lucide-react';
import api from '../api/axios';

export default function MechanicProfile() {
  const { id } = useParams();
  const nav = useNavigate();
  const [mechanic, setMechanic] = useState(null);
  const [reqForm, setReqForm] = useState({ vehicleInfo: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/mechanics/${id}`).then((res) => setMechanic(res.data));
  }, [id]);

  const sendRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/requests', { ...reqForm, mechanicId: id });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        nav('/dashboard');
      }, 2000);
    } catch {
      alert('Error sending request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!mechanic) {
    return <div className="page-loader">Loading mechanic profile...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="profile-shell">
      <section className="profile-hero glass-card">
        <div className="profile-hero-image">
          <div className="dashboard-hero-overlay" />
          <div className="brand-scene scene-profile" aria-hidden="true">
            <div className="scene-backdrop" />
            <div className="scene-gridplane" />
            <div className="scene-showcase-card scene-showcase-main">
              <span>Mechanic profile</span>
              <strong>Premium booking presentation</strong>
            </div>
          </div>
        </div>

        <div className="profile-hero-content">
          <div className="profile-avatar">
            {mechanic.name?.substring(0, 2)?.toUpperCase() || 'MF'}
          </div>
          <div className="profile-headline">
            <span className="section-kicker">Verified mechanic profile</span>
            <h1>{mechanic.name}</h1>
            <div className="profile-meta-row">
              <span className="availability-pill">{mechanic.isAvailable ? 'Available now' : 'Busy'}</span>
              <span className="mechanic-rating">
                <Star size={12} />
                {mechanic.rating || '5.0'}
              </span>
            </div>
            <p>{mechanic.specialization}</p>
          </div>
        </div>
      </section>

      <section className="profile-grid">
        <div className="dashboard-panel glass-card">
          <div className="dashboard-panel-header">
            <div>
              <span className="section-kicker">Overview</span>
              <h2>About this mechanic</h2>
            </div>
          </div>

          <div className="assurance-list">
            <div className="experience-item">
              <Phone size={16} />
              <span>{mechanic.phone || 'Phone unavailable'}</span>
            </div>
            <div className="experience-item">
              <MapPin size={16} />
              <span>Service coverage up to 10 miles from current operating area.</span>
            </div>
            <div className="experience-item">
              <ShieldCheck size={16} />
              <span>Profile framed with stronger trust and service-quality signals.</span>
            </div>
          </div>

          <div className="reviews-section">
            <h3>Reviews ({mechanic.reviews?.length || 0})</h3>
            {mechanic.reviews?.length > 0 ? (
              <div className="request-stack">
                {mechanic.reviews.map((review, index) => (
                  <article key={index} className="request-card">
                    <div className="request-card-top">
                      <div>
                        <h3>{review.userId?.username || 'Customer'}</h3>
                        <p>{review.comment}</p>
                      </div>
                      <span className="mechanic-rating">
                        <Star size={12} />
                        {review.rating}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-muted">No reviews yet.</p>
            )}
          </div>
        </div>

        <div className="dashboard-panel glass-card request-form-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="section-kicker">Send request</span>
              <h2>Book help with a premium form layout</h2>
            </div>
          </div>

          <form onSubmit={sendRequest} className="flex-col">
            <div className="input-group">
              <input
                type="text"
                placeholder=" "
                value={reqForm.vehicleInfo}
                onChange={(e) => setReqForm({ ...reqForm, vehicleInfo: e.target.value })}
                required
              />
              <label>Vehicle Info</label>
            </div>

            <div className="input-group">
              <textarea
                rows="5"
                placeholder=" "
                value={reqForm.description}
                onChange={(e) => setReqForm({ ...reqForm, description: e.target.value })}
                required
              />
              <label>Describe the issue</label>
            </div>

            <div className="request-form-highlight">
              <CarFront size={16} />
              Clearer spacing and stronger call-to-action treatment make this booking flow feel much more intentional.
            </div>

            <button type="submit" disabled={submitting || success} className={`btn-primary w-full ${success ? 'success-button' : ''}`}>
              {success ? (
                <>
                  <CheckCircle size={16} />
                  Request sent
                </>
              ) : submitting ? 'Sending...' : 'Send service request'}
            </button>
          </form>
        </div>
      </section>
    </motion.div>
  );
}
