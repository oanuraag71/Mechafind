import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, ShieldCheck, Sparkles, Star, Wrench } from 'lucide-react';
import api from '../api/axios';

const FILTERS = ['All', 'Engine', 'Tyres', 'Electrical', 'AC', 'Body Work', 'General Auto Repair'];

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const nav = useNavigate();

  useEffect(() => {
    api.get('/mechanics').then((res) => {
      setMechanics(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    }).catch(() => {
      setMechanics([]);
      setLoading(false);
    });
  }, []);

  const filtered = mechanics.filter((mechanic) => {
    const name = mechanic.name?.toLowerCase() || '';
    const specialization = mechanic.specialization || '';
    const matchSearch = name.includes(search.toLowerCase()) || specialization.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || specialization.includes(activeFilter);
    return matchSearch && matchFilter;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="directory-shell">
      <section className="directory-hero glass-card">
        <div className="directory-hero-copy">
          <span className="section-kicker">Premium Mechanic Discovery</span>
          <h1>Discover specialists who feel curated, not casually listed.</h1>
          <p>
            Search by skill, availability, and trust signals through a layout designed to feel more concierge-led than directory-heavy.
          </p>

          <div className="hero-trust-row">
            <div className="trust-badge">
              <ShieldCheck size={14} />
              Verified pros
            </div>
            <div className="trust-badge">
              <Sparkles size={14} />
              Cleaner discovery flow
            </div>
          </div>
        </div>

        <div className="directory-hero-visual">
          <div className="dashboard-hero-overlay" />
          <div className="brand-scene scene-directory" aria-hidden="true">
            <div className="scene-backdrop" />
            <div className="scene-orbit orbit-b" />
            <div className="scene-arc" />
            <div className="scene-showcase-card scene-showcase-main">
              <span>Specialist curation</span>
              <strong>Search, compare, and book with confidence</strong>
            </div>
          </div>
          <div className="directory-highlight-card">
            <strong>Premium workshop quality</strong>
            <p>Bespoke brand visuals now support the product story instead of relying on generic stock-photo treatment.</p>
          </div>
        </div>
      </section>

      <section className="directory-controls glass-card">
        <label className="directory-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by mechanic name or specialty"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div className="filter-row">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? 'filter-chip active' : 'filter-chip'}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="directory-results-header">
        <div>
          <span className="section-kicker">Available network</span>
          <h2>{loading ? 'Loading specialists...' : `${filtered.length} specialists matched`}</h2>
        </div>
      </section>

      <section className="mechanic-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="mechanic-card glass-card skeleton-card" />
            ))
          : filtered.map((mechanic, index) => (
              <motion.article
                key={mechanic._id}
                className="mechanic-card glass-card mechanic-card-rich"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -8 }}
              >
                <div className="mechanic-card-banner" />
                <div className="mechanic-card-content">
                  <div className="mechanic-card-top">
                    <div className="mechanic-avatar">
                      {mechanic.name?.substring(0, 2)?.toUpperCase() || 'MF'}
                    </div>
                    <span className={mechanic.isAvailable ? 'availability-pill' : 'availability-pill busy'}>
                      {mechanic.isAvailable ? 'Available now' : 'Busy'}
                    </span>
                  </div>

                  <h3>{mechanic.name}</h3>
                  <p className="mechanic-specialty">{mechanic.specialization}</p>

                  <div className="mechanic-meta">
                    <span className="mechanic-rating">
                      <Star size={12} />
                      {mechanic.rating || '5.0'}
                    </span>
                    <span className="request-mini-detail">
                      <Wrench size={14} />
                      Verified service profile
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => nav(`/mechanics/${mechanic._id}`)}
                    className="profile-link-button"
                  >
                    View signature profile
                    <ArrowRight size={15} />
                  </button>
                </div>
              </motion.article>
            ))}
      </section>
    </motion.div>
  );
}
