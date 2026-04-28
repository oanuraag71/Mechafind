import { Link } from 'react-router-dom';
import { Clock3, MapPinned, ShieldCheck, UserPlus, Wrench } from 'lucide-react';
import { Avatar, MetricGrid, SectionHeading, getInitials } from '../components/ui';

const metrics = [
  { value: '500+', label: 'verified mechanics' },
  { value: '12 min', label: 'average response time' },
  { value: '4.9/5', label: 'customer rating' },
];

const steps = [
  {
    icon: <UserPlus size={18} />,
    title: 'Create a request',
    description: 'Describe the issue, share your vehicle details, and tell us where you need help.',
  },
  {
    icon: <MapPinned size={18} />,
    title: 'Find nearby mechanics',
    description: 'Browse available mechanics by name, skill, and current status.',
  },
  {
    icon: <Wrench size={18} />,
    title: 'Get back on the road',
    description: 'Send the job, track updates, and chat with the mechanic when needed.',
  },
];

const featuredMechanics = [
  { name: 'Adrian Cole', specialty: 'Diagnostics', rating: '4.9', city: 'Bengaluru' },
  { name: 'Nina Brooks', specialty: 'Electrical repair', rating: '5.0', city: 'Hyderabad' },
  { name: 'Marcus Hale', specialty: 'Roadside rescue', rating: '4.8', city: 'Mumbai' },
];

export default function HomePage() {
  return (
    <div className="page-section stack-lg">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="section-kicker">Fast roadside support</span>
          <h1>Find trusted mechanics without the extra clutter.</h1>
          <p>
            MechaFind helps drivers discover mechanics, send service requests, and manage repair
            updates in one clean workflow.
          </p>

          <div className="button-row">
            <Link to="/mechanics" className="btn-primary">
              Find a Mechanic
            </Link>
            <Link to="/register" className="btn-outline">
              Create Account
            </Link>
          </div>

          <div className="badge-row">
            <span className="trust-badge">
              <ShieldCheck size={14} />
              Verified network
            </span>
            <span className="trust-badge">
              <Clock3 size={14} />
              Real-time request flow
            </span>
          </div>
        </div>

        <div className="hero-summary card">
          <h2>What you can do</h2>
          <ul className="simple-list">
            <li>Browse mechanics by specialty and availability</li>
            <li>Send service requests in a few steps</li>
            <li>Track requests from dashboard to completion</li>
            <li>Use built-in chat for active mechanic jobs</li>
          </ul>
        </div>
      </section>

      <MetricGrid items={metrics} />

      <section className="content-grid">
        <article className="card">
          <SectionHeading kicker="How it works" title="Simple flow for drivers" />

          <div className="step-list">
            {steps.map((step, index) => (
              <div key={step.title} className="step-card">
                <div className="step-icon">{step.icon}</div>
                <div>
                  <div className="step-number">0{index + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <SectionHeading kicker="Featured mechanics" title="Examples from the network" />

          <div className="stack-md">
            {featuredMechanics.map((mechanic) => (
              <div key={mechanic.name} className="list-row">
                <Avatar text={getInitials(mechanic.name)} />
                <div className="grow">
                  <h3>{mechanic.name}</h3>
                  <p>{mechanic.specialty}</p>
                </div>
                <div className="list-meta">
                  <span>{mechanic.rating}</span>
                  <small>{mechanic.city}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="cta-card">
        <div>
          <span className="section-kicker">Ready to start</span>
          <h2>Open MechaFind and connect with help faster.</h2>
        </div>
        <div className="button-row">
          <Link to="/mechanics" className="btn-primary">
            Browse Mechanics
          </Link>
          <Link to="/login" className="btn-outline">
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}
