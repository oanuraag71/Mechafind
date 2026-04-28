import { useEffect, useState } from 'react';
import { Clock3, MapPinned, ShieldCheck, Wrench } from 'lucide-react';
import api from '../api/axios';
import MapComponent from '../components/MapComponent';
import { EmptyState, MetricGrid, PageHeader, SectionHeading, StatusPill, formatDate } from '../components/ui';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/requests/my').then((response) => setRequests(Array.isArray(response.data) ? response.data : [])).catch(() => setRequests([]));
    api.get('/mechanics').then((response) => setMechanics(Array.isArray(response.data) ? response.data : [])).catch(() => setMechanics([]));

    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setUserLocation({ lat: 40.7128, lng: -74.006 })
    );
  }, []);

  const stats = [
    { label: 'Total requests', value: requests.length },
    { label: 'Pending', value: requests.filter((request) => request.status === 'pending').length },
    { label: 'Accepted', value: requests.filter((request) => request.status === 'accepted').length },
    { label: 'Completed', value: requests.filter((request) => request.status === 'completed').length },
  ];

  return (
    <div className="page-section stack-lg">
      <PageHeader
        kicker="Dashboard"
        title={`Welcome, ${user?.username || 'Driver'}.`}
        description="Track your requests, check mechanic coverage, and keep support updates in one place."
      />

      <MetricGrid items={stats} />

      <section className="dashboard-grid">
        <article className="card stack-md">
          <SectionHeading kicker="Requests" title="Your service history" />

          {requests.length === 0 ? (
            <EmptyState
              icon={<Wrench size={20} />}
              title="No service requests yet"
              description="Your requests will appear here once you contact a mechanic."
            />
          ) : (
            <div className="stack-sm">
              {requests.map((request) => (
                <article key={request._id} className="request-card">
                  <div className="request-card-top">
                    <div>
                      <h3>{request.vehicleInfo}</h3>
                      <p>{request.description}</p>
                    </div>
                    <StatusPill status={request.status || 'pending'} />
                  </div>

                  <div className="request-card-footer">
                    <span className="inline-meta">
                      <Wrench size={14} />
                      {request.mechanicId?.name || 'Awaiting mechanic assignment'}
                    </span>
                    <span className="inline-meta">
                      <Clock3 size={14} />
                      {formatDate(request.requestDate)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <aside className="stack-md">
          <article className="card stack-md">
            <SectionHeading kicker="Map" title="Nearby mechanics" />
            <MapComponent mechanics={mechanics} userLocation={userLocation} />
          </article>

          <article className="card stack-sm">
            <SectionHeading kicker="Summary" title="What this page shows" />
            <div className="inline-meta">
              <MapPinned size={16} />
              Your current location and nearby mechanics
            </div>
            <div className="inline-meta">
              <ShieldCheck size={16} />
              Request status from pending to completed
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
