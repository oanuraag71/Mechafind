import { useEffect, useState } from 'react';
import { CarFront, CheckCircle, MapPin, Phone, ShieldCheck, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Avatar, SectionHeading, getInitials } from '../components/ui';

export default function MechanicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mechanic, setMechanic] = useState(null);
  const [requestForm, setRequestForm] = useState({ vehicleInfo: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/mechanics/${id}`).then((response) => setMechanic(response.data));
  }, [id]);

  const sendRequest = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/requests', { ...requestForm, mechanicId: id });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch {
      alert('Error sending request');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  if (!mechanic) {
    return <div className="page-loader">Loading mechanic profile...</div>;
  }

  return (
    <div className="page-section stack-lg">
      <section className="profile-header card">
        <Avatar text={getInitials(mechanic.name)} large />
        <div className="stack-sm grow">
          <span className="section-kicker">Mechanic profile</span>
          <h1>{mechanic.name}</h1>
          <p>{mechanic.specialization}</p>
          <div className="badge-row">
            <span className={mechanic.isAvailable ? 'availability-pill' : 'availability-pill busy'}>
              {mechanic.isAvailable ? 'Available now' : 'Busy'}
            </span>
            <span className="inline-meta">
              <Star size={14} />
              {mechanic.rating || '5.0'}
            </span>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="card stack-md">
          <SectionHeading kicker="Overview" title="About this mechanic" />

          <div className="stack-sm">
            <div className="inline-meta">
              <Phone size={16} />
              {mechanic.phone || 'Phone unavailable'}
            </div>
            <div className="inline-meta">
              <MapPin size={16} />
              Service coverage up to 10 miles from the current area.
            </div>
            <div className="inline-meta">
              <ShieldCheck size={16} />
              Verified on the MechaFind platform.
            </div>
          </div>

          <SectionHeading title="Reviews" />

          {mechanic.reviews?.length ? (
            <div className="stack-sm">
              {mechanic.reviews.map((review, index) => (
                <article key={index} className="request-card">
                  <div className="request-card-top">
                    <div>
                      <h3>{review.userId?.username || 'Customer'}</h3>
                      <p>{review.comment}</p>
                    </div>
                    <span className="inline-meta">
                      <Star size={14} />
                      {review.rating}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted-text">No reviews yet.</p>
          )}
        </article>

        <article className="card stack-md">
          <SectionHeading kicker="Send request" title="Book this mechanic" />

          <form onSubmit={sendRequest} className="stack-md">
            <div className="input-group">
              <label htmlFor="vehicle-info">Vehicle info</label>
              <input
                id="vehicle-info"
                type="text"
                value={requestForm.vehicleInfo}
                onChange={(event) => setRequestForm({ ...requestForm, vehicleInfo: event.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="issue-description">Issue description</label>
              <textarea
                id="issue-description"
                rows="5"
                value={requestForm.description}
                onChange={(event) => setRequestForm({ ...requestForm, description: event.target.value })}
                required
              />
            </div>

            <div className="info-strip">
              <CarFront size={16} />
              Share accurate vehicle details so the mechanic can prepare properly.
            </div>

            <button type="submit" disabled={submitting || success} className="btn-primary w-full">
              {success ? (
                <>
                  <CheckCircle size={16} />
                  Request sent
                </>
              ) : (
                'Send Request'
              )}
            </button>
          </form>
        </article>
      </section>
    </div>
  );
}
