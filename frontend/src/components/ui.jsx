export const getInitials = (value = 'MF') =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'MF';

export const formatDate = (value, fallback = 'Just now') =>
  (value ? new Date(value).toLocaleString() : fallback);

export function PageHeader({ kicker, title, description, children }) {
  return (
    <section className="page-header card">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function SectionHeading({ kicker, title }) {
  return (
    <div className="section-heading">
      {kicker && <span className="section-kicker">{kicker}</span>}
      <h2>{title}</h2>
    </div>
  );
}

export function MetricGrid({ items }) {
  return (
    <section className="metric-grid">
      {items.map(({ label, value }) => (
        <article key={label} className="metric-card card">
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </section>
  );
}

export function Avatar({ text = 'MF', large = false }) {
  return <div className={large ? 'avatar avatar-lg' : 'avatar'}>{text}</div>;
}

export function EmptyState({ icon, title, description }) {
  return (
    <div className="empty-state-panel">
      {icon}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function StatusPill({ status = 'pending' }) {
  return <span className={`status-pill status-${status}`}>{status}</span>;
}

export function FormField({ id, label, as = 'input', children, ...props }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      {children || as === 'textarea' ? children || <textarea id={id} {...props} /> : <input id={id} {...props} />}
    </div>
  );
}

export function AuthIntro({ kicker, title, description }) {
  return (
    <section className="auth-info card">
      <span className="section-kicker">{kicker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
