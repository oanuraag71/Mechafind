import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock3, MessageSquare, Wrench } from 'lucide-react';
import api from '../api/axios';
import LiveChat from '../components/LiveChat';
import { EmptyState, MetricGrid, PageHeader, SectionHeading, StatusPill, formatDate } from '../components/ui';

export default function MechanicDashboard() {
  const [requests, setRequests] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const loadRequests = () =>
    api.get('/requests/mechanic').then((response) => setRequests(Array.isArray(response.data) ? response.data : [])).catch(() => setRequests([]));

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/requests/${id}/status`, { status });
    loadRequests();
  };

  const activeRequests = requests.filter((request) => request.status === 'pending' || request.status === 'accepted');
  const history = requests.filter((request) => request.status === 'completed' || request.status === 'rejected');
  const stats = [
    { label: 'Total', value: requests.length },
    { label: 'Pending', value: requests.filter((request) => request.status === 'pending').length },
    { label: 'Active', value: requests.filter((request) => request.status === 'accepted').length },
    { label: 'Completed', value: requests.filter((request) => request.status === 'completed').length },
  ];

  return (
    <div className="page-section stack-lg">
      <PageHeader
        kicker="Mechanic dashboard"
        title="Manage assigned jobs."
        description="Accept new requests, complete active work, and open live chat when a customer needs updates."
      />

      <MetricGrid items={stats} />

      <section className="card stack-md">
        <SectionHeading kicker="Active work" title="Pending and accepted requests" />

        {activeRequests.length === 0 ? (
          <EmptyState
            icon={<CheckCircle size={20} />}
            title="No active requests"
            description="New mechanic jobs will appear here."
          />
        ) : (
          <div className="ticket-grid">
            {activeRequests.map((request) => (
              <article key={request._id} className="service-ticket card">
                {request.isEmergency && (
                  <div className="emergency-pill">
                    <AlertTriangle size={14} />
                    Emergency
                  </div>
                )}

                <div className="request-card-top">
                    <div>
                      <h3>{request.ownerId?.username || 'Customer'}</h3>
                      <p>{request.ownerId?.phone || 'Phone unavailable'}</p>
                    </div>
                    <StatusPill status={request.status || 'pending'} />
                  </div>

                <div className="stack-sm">
                  <div className="inline-meta">
                    <Wrench size={14} />
                    {request.vehicleInfo}
                  </div>
                  <p>{request.description}</p>
                </div>

                {request.status === 'pending' && (
                  <div className="button-row">
                    <button type="button" className="btn-primary" onClick={() => updateStatus(request._id, 'accepted')}>
                      Accept
                    </button>
                    <button type="button" className="btn-outline" onClick={() => updateStatus(request._id, 'rejected')}>
                      Reject
                    </button>
                  </div>
                )}

                {request.status === 'accepted' && (
                  <div className="button-row">
                    <button type="button" className="btn-outline" onClick={() => setActiveChat(request._id)}>
                      <MessageSquare size={16} />
                      Chat
                    </button>
                    <button type="button" className="btn-primary" onClick={() => updateStatus(request._id, 'completed')}>
                      Complete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className="card stack-md">
          <SectionHeading kicker="History" title="Completed and rejected jobs" />

          <div className="stack-sm">
            {history.map((request) => (
              <div key={request._id} className="history-card">
                <div>
                  <h3>{request.vehicleInfo}</h3>
                  <p>{request.ownerId?.username || 'Customer'} | {formatDate(request.requestDate, 'No date')}</p>
                </div>
                <StatusPill status={request.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {activeChat && <LiveChat requestId={activeChat} />}
    </div>
  );
}
