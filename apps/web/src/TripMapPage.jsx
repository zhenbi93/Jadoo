import { Navigate, useParams } from 'react-router-dom';
import { trips } from './TripsPage.jsx';

export default function TripMapPage() {
  const { city } = useParams();
  const trip = trips.find((item) => item.city.toLowerCase() === city);
  if (!trip) return <Navigate to="/" replace />;

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center text-slate-900">
      <h1 className="text-3xl font-semibold">map {trip.city}</h1>
    </main>
  );
}
