import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavigationBar, TripsIntro } from './TripsPage.jsx';
import countries from './trip-countries.json';
import './create-trip.css';

const millisecondsPerDay = 86_400_000;
const unlistedRegion = 'No province / region listed';
const latestStart = '9999-12-30';
const latestEnd = '9999-12-31';
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(value) ? date : null;
}

function getLocalDate() {
  const now = new Date();
  const pad = (part) => String(part).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function getErrors(draft, startDate, endDate, today) {
  const errors = {};
  if (!draft.name.trim()) errors.name = 'Enter a trip name.';
  if (!draft.country) errors.country = 'Select a country.';
  else if (!draft.region) errors.region = 'Select a province or region.';
  else if (!draft.city) errors.city = 'Select a city.';
  if (!startDate || draft.startDate > latestStart) {
    errors.startDate = 'Choose a valid start date.';
  } else if (draft.startDate < today) {
    errors.startDate = 'Start date must be today or later.';
  }
  if (!endDate) {
    errors.endDate = 'Choose a valid end date.';
  } else if (startDate && endDate <= startDate) {
    errors.endDate = 'End date must be at least one day after the start date.';
  }
  return errors;
}

function useCountryRegions(country) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!country) return;
    const controller = new AbortController();
    const url = `${import.meta.env.BASE_URL}trip-locations/${country}.json`;

    async function loadRegions() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Could not load regions');
        const regions = await response.json();
        if (!controller.signal.aborted) setResult({ country, regions });
      } catch {
        if (!controller.signal.aborted) setResult({ country, regions: [], failed: true });
      }
    }

    void loadRegions();
    return () => controller.abort();
  }, [country]);

  return result?.country === country ? result : null;
}

function TripField({ name, label, value, error, onChange, dateHint, ...attributes }) {
  const id = `create-trip-${name}`;

  return (
    <div className="create-trip-field">
      <label htmlFor={id}>{label}</label>
      <div className={dateHint && !value ? 'create-trip-empty-date' : undefined}>
        <input
          {...attributes}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {dateHint && !value && <span aria-hidden="true">{dateHint}</span>}
      </div>
      {error && <p className="create-trip-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

function LocationField({ name, label, placeholder, value, disabled, error, onChange, children }) {
  const id = `create-trip-${name}`;
  return (
    <div className="create-trip-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
      {error && <p className="create-trip-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

function TripPreview({ name, destination, dates, nights }) {
  return (
    <aside className="create-trip-preview" aria-labelledby="trip-preview-heading">
      <p className="trip-eyebrow">Your trip at a glance</p>
      <h2 id="trip-preview-heading">{destination || 'Your destination'}</h2>
      <p className="create-trip-preview-name">{name.trim() || 'Your trip name'}</p>

      <div className="create-trip-preview-dates">
        <p className="trip-eyebrow">Travel dates</p>
        <p className="create-trip-range">{dates}</p>
        <dl className="create-trip-stats">
          <div>
            <dt>days to explore</dt>
            <dd>{nights === null ? '—' : nights + 1}</dd>
          </div>
          <div>
            <dt>{nights === 1 ? 'night away' : 'nights away'}</dt>
            <dd>{nights ?? '—'}</dd>
          </div>
        </dl>
      </div>

      <h3>Next, make it yours.</h3>
      <p className="create-trip-preview-note">Add places and activities to shape your day-by-day itinerary.</p>
      <p className="create-trip-preview-tagline">A little planning. A world of memories.</p>
    </aside>
  );
}

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState({
    name: '', country: '', region: '', city: '', startDate: '', endDate: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [today, setToday] = useState(getLocalDate);
  const countryData = useCountryRegions(draft.country);

  useEffect(() => {
    const refresh = () => setToday(getLocalDate());
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const countryName = countries.find(({ code }) => code === draft.country)?.name;
  const regions = countryData?.regions ?? [];
  const selectedRegion = regions.find(({ name }) => (name ?? unlistedRegion) === draft.region);
  const destinationParts = [draft.city, selectedRegion?.name, countryName].filter(Boolean);
  const destination = [...new Set(destinationParts)].join(', ');
  const startDate = parseDate(draft.startDate);
  const endDate = parseDate(draft.endDate);
  const errors = getErrors(draft, startDate, endDate, today);
  const earliestEnd = errors.startDate
    ? undefined
    : new Date(startDate.getTime() + millisecondsPerDay).toISOString().slice(0, 10);
  const hasRange = !errors.startDate && !errors.endDate;
  const nights = hasRange ? (endDate.getTime() - startDate.getTime()) / millisecondsPerDay : null;

  let dates = 'Select travel dates';
  if (hasRange) {
    dates = dateFormat.formatRange(startDate, endDate);
  } else if ((draft.startDate && errors.startDate) || (draft.endDate && errors.endDate)) {
    dates = 'Check the date range';
  } else if (startDate) {
    dates = `Starts ${dateFormat.format(startDate)}`;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setDraft((previous) => {
      if (name === 'country') return { ...previous, country: value, region: '', city: '' };
      if (name === 'region') return { ...previous, region: value, city: '' };
      return { ...previous, [name]: value };
    });
  }

  function submitTrip(event) {
    event.preventDefault();
    const currentDate = getLocalDate();
    setToday(currentDate);
    const firstInvalid = Object.keys(getErrors(draft, startDate, endDate, currentDate))[0];
    if (firstInvalid) {
      setSubmitted(true);
      event.currentTarget.elements.namedItem(firstInvalid)?.focus();
      return;
    }
    navigate('/');
  }

  return (
    <div className="trips-page">
      <NavigationBar />
      <main className="trip-container trip-main">
        <TripsIntro />
        <div className="create-trip-layout">
          <form className="create-trip-form" aria-labelledby="create-trip-heading" onSubmit={submitTrip} noValidate>
            <p className="trip-eyebrow">New adventure</p>
            <h2 id="create-trip-heading">Create a trip</h2>
            <p className="create-trip-description">Every great trip starts with a few details.</p>

            <div className="create-trip-fields">
              <TripField
                name="name"
                label="Trip name"
                placeholder="A weekend in Paris"
                value={draft.name}
                error={submitted && errors.name}
                onChange={updateField}
              />
              <fieldset>
                <legend className="create-trip-location-label">Destination</legend>
                <div className="create-trip-location-fields">
                  <LocationField
                    name="country" label="Country" placeholder="Select a country"
                    value={draft.country} error={submitted && errors.country} onChange={updateField}
                  >
                    {countries.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
                  </LocationField>
                  <LocationField
                    name="region" label="Province / region" placeholder="Select a province or region"
                    value={draft.region} disabled={!regions.length} error={submitted && errors.region}
                    onChange={updateField}
                  >
                    {regions.map(({ name }) => (
                      <option key={name ?? unlistedRegion}>{name ?? unlistedRegion}</option>
                    ))}
                  </LocationField>
                  <LocationField
                    name="city" label="City" placeholder="Select a city"
                    value={draft.city} disabled={!selectedRegion} error={submitted && errors.city}
                    onChange={updateField}
                  >
                    {selectedRegion?.cities.map((city) => <option key={city}>{city}</option>)}
                  </LocationField>
                </div>
                {draft.country && !countryData && <p className="create-trip-location-note" role="status">Loading regions…</p>}
                {countryData?.failed && (
                  <p className="create-trip-error" role="alert">Could not load regions. Reload the page and try again.</p>
                )}
                <p className="create-trip-location-note">Location data by <a href="https://www.geonames.org/">GeoNames</a></p>
              </fieldset>
              <div className="create-trip-date-fields">
                <TripField
                  name="startDate" label="Start date" type="date" lang="en"
                  dateHint="Select start date" value={draft.startDate} min={today} max={latestStart}
                  error={(submitted || draft.startDate) && errors.startDate} onChange={updateField}
                />
                <TripField
                  name="endDate" label="End date" type="date" lang="en"
                  dateHint="Select end date" value={draft.endDate} min={earliestEnd} max={latestEnd}
                  disabled={!earliestEnd} error={earliestEnd && (submitted || draft.endDate) && errors.endDate}
                  onChange={updateField}
                />
              </div>
            </div>

            {nights !== null && (
              <p className="create-trip-duration">
                {nights + 1} days · {nights} {nights === 1 ? 'night' : 'nights'}
              </p>
            )}

            <div className="create-trip-footer">
              <p>All fields are required.</p>
              <div className="create-trip-actions">
                <Link to="/" className="create-trip-cancel">Cancel</Link>
                <button type="submit" className="trip-action create-trip-submit">Create trip</button>
              </div>
            </div>
          </form>

          <TripPreview name={draft.name} destination={destination} dates={dates} nights={nights} />
        </div>
      </main>
    </div>
  );
}
