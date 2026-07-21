import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Wrench } from 'lucide-react';
import api from '../api/axios';
import { Avatar, PageHeader, SectionHeading, getInitials } from '../components/ui';

const FILTERS = ['All', 'Engine', 'Tyres', 'Electrical', 'AC', 'Body Work', 'General Auto Repair'];

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/mechanics')
      .then((response) => setMechanics(Array.isArray(response.data) ? response.data : []))
      .catch(() => setMechanics([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredMechanics = mechanics.filter((mechanic) => {
    const name = mechanic.name?.toLowerCase() || '';
    const specialization = mechanic.specialization?.toLowerCase() || '';
    const term = search.toLowerCase();
    const matchesSearch = name.includes(term) || specialization.includes(term);
    const matchesFilter =
      activeFilter === 'All' || mechanic.specialization?.toLowerCase().includes(activeFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-section stack-lg">
      <PageHeader
        kicker="Mechanics"
        title="Find a mechanic near you."
        description="Search the network, filter by specialty, and open a profile to send a request."
      />

      <section className="card stack-md">
        <label className="search-field">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by mechanic name or specialty"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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

      <SectionHeading kicker="Results" title={loading ? 'Loading mechanics...' : `${filteredMechanics.length} mechanics found`} />

      <section className="mechanic-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <div key={index} className="mechanic-card card skeleton-card" />)
          : filteredMechanics.map((mechanic) => (
              <article key={mechanic._id} className="mechanic-card card">
                <div className="mechanic-card-top">
                  <Avatar text={getInitials(mechanic.name)} />
                  <span className={mechanic.isAvailable ? 'availability-pill' : 'availability-pill busy'}>
                    {mechanic.isAvailable ? 'Available' : 'Busy'}
                  </span>
                </div>

                <div className="stack-sm">
                  <h3>{mechanic.name}</h3>
                  <p className="muted-text">{mechanic.specialization}</p>
                </div>

                <div className="mechanic-meta">
                  <span className="inline-meta">
                    <Star size={14} />
                    {mechanic.rating || '5.0'}
                  </span>
                  <span className="inline-meta">
                    <Wrench size={14} />
                    Verified profile
                  </span>
                </div>

                <button type="button" className="btn-primary w-full" onClick={() => navigate(`/mechanics/${mechanic._id}`)}>
                  View Profile
                </button>
              </article>
            ))}
      </section>
    </div>
  );
}
