import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock3, MessageSquare, ShieldCheck, UserRound, Wrench } from 'lucide-react';
import api from '../api/axios';
import LiveChat from '../components/LiveChat';

export default function MechanicDashboard() {
  const [requests, setRequests] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);

  const load = () =>
    api.get('/requests/mechanic').then((r) => setRequests(Array.isArray(r.data) ? r.data : [])).catch(() => setRequests([]));

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    if (status === 'accepted') {
      setAnimatingId(id);
      setTimeout(() => setAnimatingId(null), 1000);
    }
    await api.put(`/requests/${id}/status`, { status });
    load();
  };

  const getStatusColor = (status, isEmergency) => {
    if (isEmergency && status !== 'completed') return 'danger';
    if (status === 'pending') return 'gold';
    if (status === 'accepted') return 'green';
    return 'blue';
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    accepted: requests.filter((r) => r.status === 'accepted').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending' || r.status === 'accepted');
  const completedRequests = requests.filter((r) => r.status === 'completed' || r.status === 'rejected');

  const statCards = [
    { label: 'Total handled', value: stats.total, icon: <Wrench size={18} />, accent: 'blue' },
    { label: 'Pending', value: stats.pending, icon: <Clock3 size={18} />, accent: 'gold' },
    { label: 'Active jobs', value: stats.accepted, icon: <UserRound size={18} />, accent: 'green' },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle size={18} />, accent: 'blue' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-shell">
      <section className="dashboard-hero glass-card">
        <div className="dashboard-hero-copy">
          <span className="section-kicker">Mechanic Operations</span>
          <h1>Run incoming jobs through a dashboard that feels sharper, calmer, and more premium.</h1>
          <p>
            Prioritize emergencies, respond faster, and move from pending work to completion without unnecessary visual clutter.
          </p>

          <div className="dashboard-hero-badges">
            <span className="trust-badge">
              <ShieldCheck size={14} />
              Emergency-aware workflow
            </span>
            <span className="trust-badge">
              <MessageSquare size={14} />
              Integrated live chat
            </span>
          </div>
        </div>

        <div className="dashboard-hero-visual">
          <div className="dashboard-hero-overlay" />
          <div className="brand-scene scene-mechanic" aria-hidden="true">
            <div className="scene-backdrop" />
            <div className="scene-orbit orbit-a" />
            <div className="scene-wheel" />
            <div className="scene-showcase-card scene-showcase-main">
              <span>Workshop ops</span>
              <strong>Urgency-first mechanic workflow</strong>
            </div>
          </div>
          <div className="dashboard-hero-floating">
            <span>Mechanic view</span>
            <strong>{stats.accepted} active jobs</strong>
            <p>Requests are grouped visually so urgent work is easier to spot and action quickly.</p>
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
            <div className="stat-with-icon">
              <span className="stat-icon-shell">{card.icon}</span>
              <span>{card.label}</span>
            </div>
            <strong>{card.value}</strong>
          </motion.div>
        ))}
      </section>

      <section className="dashboard-panel glass-card">
        <div className="dashboard-panel-header">
          <div>
            <span className="section-kicker">Active requests</span>
            <h2>Pending and in-progress work</h2>
          </div>
        </div>

        <div className="request-board">
          <AnimatePresence mode="popLayout">
            {pendingRequests.length === 0 ? (
              <div className="empty-state-panel">
                <CheckCircle size={20} />
                <h3>No active requests</h3>
                <p>You are fully caught up. New service jobs will appear here the moment they arrive.</p>
              </div>
            ) : (
              pendingRequests.map((request) => {
                const color = getStatusColor(request.status, request.isEmergency);
                return (
                  <motion.article
                    key={request._id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className={`service-ticket glass-card ticket-${color} ${animatingId === request._id ? 'confetti' : ''}`}
                  >
                    {request.isEmergency && (
                      <div className="emergency-pill">
                        <AlertTriangle size={14} />
                        Emergency
                      </div>
                    )}

                    <div className="service-ticket-top">
                      <div>
                        <h3>{request.ownerId?.username || 'Customer'}</h3>
                        <p>{request.ownerId?.phone || 'Phone unavailable'}</p>
                      </div>
                      <span className={`status-pill status-${request.status || 'pending'}`}>
                        {request.status || 'pending'}
                      </span>
                    </div>

                    <div className="service-ticket-body">
                      <div className="request-mini-detail">
                        <Wrench size={14} />
                        {request.vehicleInfo}
                      </div>
                      <p>{request.description}</p>
                    </div>

                    {request.status === 'pending' && (
                      <div className="ticket-actions">
                        <button type="button" className="btn-primary" onClick={() => updateStatus(request._id, 'accepted')}>
                          Accept service
                        </button>
                        <button type="button" className="btn-outline reject-button" onClick={() => updateStatus(request._id, 'rejected')}>
                          Reject
                        </button>
                      </div>
                    )}

                    {request.status === 'accepted' && (
                      <div className="ticket-actions">
                        <button type="button" className="btn-outline" onClick={() => setActiveChat(request._id)}>
                          <MessageSquare size={16} />
                          Live chat
                        </button>
                        <button type="button" className="btn-primary" onClick={() => updateStatus(request._id, 'completed')}>
                          Mark complete
                        </button>
                      </div>
                    )}
                  </motion.article>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </section>

      {completedRequests.length > 0 && (
        <section className="dashboard-panel glass-card">
          <div className="dashboard-panel-header">
            <div>
              <span className="section-kicker">History</span>
              <h2>Completed and closed jobs</h2>
            </div>
          </div>

          <div className="history-list">
            {completedRequests.map((request) => (
              <div key={request._id} className="history-card">
                <div>
                  <h3>{request.vehicleInfo}</h3>
                  <p>{request.ownerId?.username || 'Customer'} • {request.requestDate ? new Date(request.requestDate).toLocaleString() : 'No date'}</p>
                </div>
                <span className={`status-pill status-${request.status}`}>{request.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeChat && <LiveChat requestId={activeChat} />}
    </motion.div>
  );
}
