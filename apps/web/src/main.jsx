import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { create } from 'zustand';
import './index.css';
import CreateTripPage from './CreateTripPage.jsx';
import DailyItineraryPage from './DailyItineraryPage.jsx';
import TripMapPage from './TripMapPage.jsx';
import TripsPage from './TripsPage.jsx';

const useConnection = create((set) => ({
  status: 'check',
  async check() {
    set({ status: 'checking' });
    try {
      const response = await fetch('/api/health');
      const healthy = response.ok && (await response.json()).status === 'ok';
      set({ status: healthy ? 'linked' : 'unable to link' });
    } catch {
      set({ status: 'unable to connect' });
    }
  },
}));

function EnvironmentStatus() {
  const { status, check } = useConnection();
  useEffect(() => { void check(); }, [check]);

  return (
    <main className="mx-auto max-w-lg px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-semibold">Travel Notebook</h1>
      <p className="mt-6 rounded-lg border border-slate-200 p-4" role="status">
        Express API · {status}
      </p>
      <button className="mt-4 cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-white" onClick={check}>
        重新检查
      </button>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TripsPage />} />
        <Route path="/trips/new" element={<CreateTripPage />} />
        <Route path="/trips/rome/itinerary/day-2" element={<DailyItineraryPage />} />
        <Route path="/trips/:city/map" element={<TripMapPage />} />
        <Route path="/status" element={<EnvironmentStatus />} />
        <Route path="*" element={<Link to="/">Back to My trips</Link>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
