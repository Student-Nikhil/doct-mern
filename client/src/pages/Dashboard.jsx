import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCalendar, FiClock, FiXCircle } from 'react-icons/fi';
import DoctorsExplorer from '../components/DoctorsExplorer.jsx';
import { fetchAppointments } from '../store/appointmentsSlice.js';
import { formatDate } from '../utils/helpers.js';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const items = useSelector((s) => s.appointments.items);
  useEffect(() => { dispatch(fetchAppointments()); }, [dispatch]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = items.filter((a) => a.status === 'booked' && a.date.slice(0, 10) >= today).reverse();
  const cancelled = items.filter((a) => a.status === 'cancelled').length;
  const next = upcoming[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold sm:text-5xl">Hello, {user?.name?.split(' ')[0]}</h1>
      <p className="mt-2 opacity-70">Here is where your care stands today.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="glass p-6 md:col-span-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-400"><FiCalendar /> Next appointment</p>
          {next ? (
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <img src={next.doctor?.image} alt="" className="h-16 w-16 rounded-2xl" />
              <div className="flex-1">
                <p className="font-display text-xl font-bold">{next.doctor?.name}</p>
                <p className="flex items-center gap-2 text-sm opacity-75"><FiClock /> {formatDate(next.date)} at {next.time}</p>
              </div>
              <Link to="/appointments" className="btn-ghost !py-2">Manage</Link>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="opacity-75">You have nothing booked. Pick a doctor below to get started.</p>
              <Link to="/book" className="btn-coral !py-2">Book appointment</Link>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-5"><p className="font-display text-4xl font-extrabold text-teal-700 dark:text-teal-400">{upcoming.length}</p><p className="text-sm opacity-70">Upcoming</p></div>
          <div className="glass p-5"><p className="flex items-center gap-1 font-display text-4xl font-extrabold text-coral-500">{cancelled}</p><p className="flex items-center gap-1 text-sm opacity-70"><FiXCircle /> Cancelled</p></div>
        </div>
      </div>

      <h2 className="mb-5 mt-14 text-2xl font-extrabold sm:text-3xl">Doctors available now</h2>
      <DoctorsExplorer limit={6} />
      <Link to="/doctors" className="btn-ghost mt-8">See all doctors</Link>
    </section>
  );
}
