import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaBolt,
  FaCheckCircle,
  FaInstagram,
  FaLinkedin,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaTools,
  FaTwitter,
  FaUserPlus,
} from 'react-icons/fa';
import logoMark from '../assets/mechafind-logo.svg';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const metrics = [
  { value: '500+', label: 'verified mechanics across key urban corridors' },
  { value: '12 min', label: 'average time to connect with a nearby expert' },
  { value: '4.9/5', label: 'customer satisfaction across completed jobs' },
];

const steps = [
  {
    icon: <FaUserPlus size={18} />,
    title: 'Tell us what happened',
    desc: 'Share your issue, location, and urgency so the platform can route the best-fit response.',
  },
  {
    icon: <FaSearch size={18} />,
    title: 'See vetted experts nearby',
    desc: 'Browse specialists with transparent ratings, response windows, and service capabilities.',
  },
  {
    icon: <FaTools size={18} />,
    title: 'Get moving again',
    desc: 'Chat, approve the job, and track progress with a premium service experience from first tap to fix.',
  },
];

const serviceHighlights = [
  'Roadside recovery and diagnostics',
  'Premium workshop and on-site appointments',
  'Live status updates with service transparency',
  'Verified specialists for luxury and daily-use vehicles',
];

const mechanicCards = [
  {
    name: 'Adrian Cole',
    specialty: 'Performance & ECU Diagnostics',
    rating: '4.9',
    city: 'Bengaluru',
  },
  {
    name: 'Nina Brooks',
    specialty: 'Electrical Systems & Hybrid Repairs',
    rating: '5.0',
    city: 'Hyderabad',
  },
  {
    name: 'Marcus Hale',
    specialty: 'Roadside Rescue & Transmission',
    rating: '4.8',
    city: 'Mumbai',
  },
];

const galleryImages = [
  {
    title: 'Luxury garage environment',
    subtitle: 'Premium workshop atmosphere',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'On-road assistance',
    subtitle: 'Fast response when drivers need it most',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Detail-driven service',
    subtitle: 'A cleaner, more premium repair experience',
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-backdrop" aria-hidden="true">
        <div className="home-orb home-orb-one" />
        <div className="home-orb home-orb-two" />
        <div className="home-grid" />
      </div>

      <section className="hero-section">
        <motion.div
          className="hero-layout"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-copy">
            <motion.div variants={fadeUp} className="eyebrow-pill">
              Concierge-grade roadside assistance for modern drivers
            </motion.div>

            <motion.div variants={fadeUp} className="hero-brand-lockup">
              <img src={logoMark} alt="MechaFind logo" className="hero-brand-mark" />
              <span>MechaFind Signature Assist</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="hero-title">
              Find the right mechanic with the confidence of a luxury service brand.
            </motion.h1>

            <motion.p variants={fadeUp} className="hero-description">
              MechaFind helps drivers discover verified mechanics, book urgent help faster,
              and manage repairs through a cleaner, smoother experience that feels built for premium customers.
            </motion.p>

            <motion.div variants={fadeUp} className="hero-actions">
              <Link to="/mechanics" className="btn-primary hero-btn">
                Find a Mechanic
                <FaArrowRight size={14} />
              </Link>
              <Link to="/register" className="btn-outline hero-btn">
                Join as Mechanic
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="hero-trust-row">
              <div className="trust-badge">
                <FaShieldAlt size={14} />
                Verified professionals only
              </div>
              <div className="trust-badge">
                <FaBolt size={14} />
                Fast-match emergency support
              </div>
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-frame">
              <div className="brand-scene scene-home" aria-hidden="true">
                <div className="scene-backdrop" />
                <div className="scene-orbit orbit-a" />
                <div className="scene-orbit orbit-b" />
                <div className="scene-arc" />
                <div className="scene-gridplane" />
                <div className="scene-showcase-card scene-showcase-main">
                  <img src={logoMark} alt="" className="scene-logo" />
                  <span>Elite Response</span>
                  <strong>Concierge-grade mechanic matching</strong>
                </div>
                <div className="scene-showcase-card scene-showcase-side">
                  <span>Coverage</span>
                  <strong>Citywide and roadside</strong>
                </div>
                <div className="scene-wheel" />
              </div>
              <div className="floating-card floating-card-top">
                <span className="floating-label">Response Window</span>
                <strong>12 mins avg</strong>
                <p>Fastest nearby specialist now available</p>
              </div>
              <div className="floating-card floating-card-bottom">
                <div className="floating-stars">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <strong>Trusted by premium car owners</strong>
                <p>Clean communication. Accurate diagnostics. Zero clutter.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="metrics-section">
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              className="metric-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55 }}
            >
              <div className="metric-value">{metric.value}</div>
              <p>{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="gallery-section">
        <div className="section-intro section-intro-centered">
          <span className="section-kicker">Brand imagery</span>
          <h2>The home screen now sells the world of the product, not just the feature list.</h2>
          <p>
            These supporting visuals make the landing page feel more premium, more automotive, and much less like a plain app shell.
          </p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((item, index) => (
            <motion.article
              key={item.title}
              className="gallery-card glass-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="gallery-card-image" style={{ backgroundImage: `url(${item.image})` }} />
              <div className="gallery-card-copy">
                <span>{item.subtitle}</span>
                <h3>{item.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="experience-section">
        <motion.div
          className="experience-panel glass-card"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
        >
          <div className="section-intro">
            <span className="section-kicker">Why it feels premium</span>
            <h2>Built around trust, response speed, and visual clarity.</h2>
            <p>
              Premium products feel calm. They guide attention, remove doubt, and make every
              action feel intentional. This experience is designed around that principle.
            </p>
          </div>

          <div className="experience-grid">
            {serviceHighlights.map((item) => (
              <div key={item} className="experience-item">
                <FaCheckCircle size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="steps-section">
        <div className="section-intro section-intro-centered">
          <span className="section-kicker">How it works</span>
          <h2>A frictionless flow from breakdown to booked help.</h2>
          <p>
            The layout is simplified so users can make decisions quickly, especially in stressful moments.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="step-card glass-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="step-number">0{index + 1}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="showcase-section">
        <div className="showcase-header">
          <div className="section-intro">
            <span className="section-kicker">Featured specialists</span>
            <h2>People-first service, presented like a serious premium platform.</h2>
          </div>
          <Link to="/mechanics" className="btn-outline">
            Explore all mechanics
          </Link>
        </div>

        <div className="mechanic-grid">
          {mechanicCards.map((mechanic, index) => (
            <motion.article
              key={mechanic.name}
              className="mechanic-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="mechanic-card-top">
                <div className="mechanic-avatar">
                  {mechanic.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </div>
                <span className="availability-pill">Available today</span>
              </div>
              <h3>{mechanic.name}</h3>
              <p className="mechanic-specialty">{mechanic.specialty}</p>
              <div className="mechanic-meta">
                <span className="mechanic-rating">
                  <FaStar size={12} />
                  {mechanic.rating}
                </span>
                <span>{mechanic.city}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          className="cta-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65 }}
        >
          <div>
            <span className="section-kicker">Ready to upgrade the experience</span>
            <h2>Make your first impression feel worthy of a premium automotive brand.</h2>
          </div>
          <div className="cta-actions">
            <Link to="/mechanics" className="btn-primary">
              Browse Mechanics
            </Link>
            <Link to="/register" className="btn-outline">
              Create Account
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <div className="footer-logo footer-logo-image-shell">
            <img src={logoMark} alt="MechaFind logo" className="brand-logo-image" />
          </div>
          <div>
            <strong>MechaFind</strong>
            <p>Premium roadside assistance and mechanic discovery.</p>
          </div>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/register">Join</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-socials">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
            <FaTwitter size={16} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram size={16} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FaLinkedin size={16} />
          </a>
        </div>
      </footer>
    </div>
  );
}
