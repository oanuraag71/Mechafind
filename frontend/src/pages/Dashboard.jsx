import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3, MapPinned, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const { user } = useAuth();

  const loadData = () => {
    api.get('/requests/my').then((r) => setRequests(Array.isArray(r.data) ? r.data : [])).catch(() => setRequests([]));
    api.get('/mechanics').then((r) => setMechanics(Array.isArray(r.data) ? r.data : [])).catch(() => setMechanics([]));
  };

  useEffect(() => {
    loadData();
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 40.7128, lng: -74.006 })
    );
  }, []);

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    accepted: requests.filter((r) => r.status === 'accepted').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  };

  const statCards = [
    { label: 'Total Requests', value: stats.total, accent: 'blue' },
    { label: 'Pending Review', value: stats.pending, accent: 'gold' },
    { label: 'Mechanic Accepted', value: stats.accepted, accent: 'green' },
    { label: 'Completed Jobs', value: stats.completed, accent: 'blue' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-shell">
      <section className="dashboard-hero glass-card">
        <div className="dashboard-hero-copy">
          <span className="section-kicker">Driver Command Center</span>
          <h1>Manage roadside assistance through a calmer, more elevated control panel.</h1>
          <p>
            Track requests, view nearby specialists, and keep every support interaction organized inside a cleaner premium interface.
          </p>

          <div className="dashboard-hero-badges">
            <span className="trust-badge">
              <ShieldCheck size={14} />
              Verified network
            </span>
            <span className="trust-badge">
              <Clock3 size={14} />
              Live status updates
            </span>
          </div>
        </div>

        <div className="dashboard-hero-visual">
          <div className="dashboard-hero-overlay" />
          <div className="brand-scene scene-dashboard" aria-hidden="true">
            <div className="scene-backdrop" />
            <div className="scene-orbit orbit-a" />
            <div className="scene-gridplane" />
            <div className="scene-showcase-card scene-showcase-main">
              <span>Driver status</span>
              <strong>Roadside intelligence at a glance</strong>
            </div>
            <div className="scene-showcase-card scene-showcase-side">
              <span>Requests</span>
              <strong>{stats.total} active records</strong>
            </div>
          </div>
          <div className="dashboard-hero-floating">
            <span>Welcome back</span>
            <strong>{user?.username || 'Driver'}</strong>
            <p>Your last known support radius is being monitored for faster help matching.</p>
          </div>
        </div>
      </section>

      <section className="dashboard-stats-grid">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            className={`dashboard-stat-card glass-card accent-${card.accent}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </motion.div>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel glass-card">
          <div className="dashboard-panel-header">
            <div>
              <span className="section-kicker">Recent activity</span>
              <h2>Your service requests</h2>
            </div>
            <span className="dashboard-panel-meta">{requests.length} entries</span>
          </div>

          {requests.length === 0 ? (
            <div className="empty-state-panel">
              <Sparkles size={20} />
              <h3>No service requests yet</h3>
              <p>Your timeline, updates, and mechanic confirmations will appear here once assistance is requested.</p>
            </div>
          ) : (
            <div className="request-stack">
              {requests.map((request) => (
                <article key={request._id} className="request-card">
                  <div className="request-card-top">
                    <div>
                      <h3>{request.vehicleInfo}</h3>
                      <p>{request.description}</p>
                    </div>
                    <span className={`status-pill status-${request.status || 'pending'}`}>
                      {request.status || 'pending'}
                    </span>
                  </div>

                  <div className="request-card-footer">
                    <span className="request-mini-detail">
                      <Wrench size={14} />
                      {request.mechanicId?.name || 'Awaiting mechanic assignment'}
                    </span>
                    <span className="request-mini-detail">
                      <Clock3 size={14} />
                      {request.requestDate ? new Date(request.requestDate).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="dashboard-sidebar">
          <div className="dashboard-panel glass-card sticky-card">
            <div className="dashboard-panel-header">
              <div>
                <span className="section-kicker">Live coverage</span>
                <h2>Nearby mechanics map</h2>
              </div>
            </div>

            <MapComponent mechanics={mechanics} userLocation={userLocation} />
          </div>

          <div className="dashboard-panel glass-card">
            <div className="dashboard-panel-header">
              <div>
                <span className="section-kicker">Quick assurance</span>
                <h2>What this dashboard optimizes</h2>
              </div>
            </div>

            <div className="assurance-list">
              <div className="experience-item">
                <MapPinned size={16} />
                <span>Spatial awareness stays clear with live coverage surfaced beside active requests.</span>
              </div>
              <div className="experience-item">
                <ShieldCheck size={16} />
                <span>Status clarity and stronger hierarchy reduce friction during urgent moments.</span>
              </div>
              <div className="experience-item">
                <ArrowRight size={16} />
                <span>Priority actions remain easy to scan without the dashboard ever feeling crowded.</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </motion.div>
  );
}
