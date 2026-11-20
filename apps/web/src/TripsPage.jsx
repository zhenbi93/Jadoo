import { Link } from 'react-router-dom';
import rome from './assets/rome.webp';
import london from './assets/london.webp';
import helsinki from './assets/helsinki.webp';
import './trips.css';

export const trips = [
  {
    name: 'A Roman holiday',
    city: 'Rome',
    country: 'Italy',
    dates: '12-16 Jun 2027',
    image: rome,
    imageAlt: 'The Colosseum in Rome',
    status: 'In progress',
    stage: 'in-progress',
  },
  {
    name: 'A weekend in London',
    city: 'London',
    country: 'United Kingdom',
    dates: '09-12 Sep 2027',
    image: london,
    imageAlt: 'The Palace of Westminster and Big Ben',
    status: 'Upcoming',
    stage: 'upcoming',
  },
  {
    name: 'Nordic summer',
    city: 'Helsinki',
    country: 'Finland',
    dates: '18-22 Aug 2026',
    image: helsinki,
    imageAlt: 'The Helsinki waterfront',
    status: 'Completed',
    stage: 'completed',
  },
];

export function NavigationBar() {
  return (
    <header className="trip-header">
      <div className="trip-container trip-header-inner">
        <span className="trip-brand">Jadoo.</span>
        <nav className="trip-nav" aria-label="Main navigation">
          <button type="button" aria-current="page">My trips</button>
        </nav>
        <p className="trip-tagline">A little planning. A world of memories.</p>
        <div className="trip-account">
          <span>Alex Morgan</span>
          <button type="button" className="trip-logout">Log out</button>
        </div>
      </div>
    </header>
  );
}

export function TripsIntro({ children }) {
  return (
    <section className="trip-intro" aria-labelledby="trip-page-heading">
      <div>
        <p className="trip-eyebrow">Your personal travel space</p>
        <h1 id="trip-page-heading">Where to next, Alex?</h1>
        <p className="trip-lead">Make a plan worth looking forward to. Keep the moments worth remembering.</p>
      </div>
      {children}
    </section>
  );
}

function TripCard({ trip }) {
  return (
    <article className="trip-card">
      <img src={trip.image} alt={trip.imageAlt} width="920" height="420" />
      <div className="trip-card-body">
        <h3>{trip.name}</h3>
        <p>{trip.city}, {trip.country}</p>
        <p className="trip-card-date">{trip.dates}</p>
        <div className="trip-card-footer">
          <span className={`trip-badge trip-badge--${trip.stage}`}>{trip.status}</span>
          <Link to={`/trips/${trip.city.toLowerCase()}/map`} aria-label={`Open ${trip.name}`}>
            Open <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function TripsPage() {
  return (
    <div className="trips-page">
      <NavigationBar />
      <main className="trip-container trip-main">
        <TripsIntro>
          <Link to="/trips/new" className="trip-action trip-create"><span aria-hidden="true">+</span> Create trip</Link>
        </TripsIntro>

        <section className="trip-featured" aria-labelledby="current-trip-heading">
          <div className="trip-featured-content">
            <p className="trip-eyebrow">Happening now</p>
            <h2 id="current-trip-heading">A Roman holiday</h2>
            <p className="trip-details">12–16 June 2027 <span>·</span> Day 2 of 5 <span>·</span> Rome, Italy</p>
            <progress className="trip-progress" value="2" max="5" aria-label="Trip progress" />
          </div>
          <Link to="/trips/rome/itinerary/day-2" className="trip-action trip-continue">
            Continue Day 2 <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className="trip-list" aria-labelledby="your-trips-heading">
          <div className="trip-list-heading">
            <h2 id="your-trips-heading">Your trips</h2>
            <p>3 trips · A world of memories</p>
          </div>
          <div className="trip-filters" role="group" aria-label="Filter trips">
            <button type="button" aria-pressed="true">All trips <span>3</span></button>
            <button type="button" aria-pressed="false">Upcoming <span>1</span></button>
            <button type="button" aria-pressed="false">Past <span>1</span></button>
          </div>
          <div className="trip-grid">
            {trips.map((trip) => <TripCard key={trip.name} trip={trip} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
