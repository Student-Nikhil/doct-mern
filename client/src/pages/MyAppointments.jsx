import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AppointmentCard from '../components/AppointmentCard.jsx';
import { fetchAppointments, cancelAppointment } from '../store/appointmentsSlice.js';
import { formatDate } from '../utils/helpers.js';

export default function MyAppointments() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.appointments);
  const [year, setYear] = useState('All');
  const [status, setStatus] = useState('All');
  const [target, setTarget] = useState(null);

  useEffect(() => { dispatch(fetchAppointments()); }, [dispatch]);

  const years = useMemo(() => [...new Set(items.map((a) => a.date.slice(0, 4)))].sort().reverse(), [items]);
  const list = items.filter((a) => (year === 'All' || a.date.startsWith(year)) && (status === 'All' || a.status === status));

  const confirmCancel = async () => {
    const res = await dispatch(cancelAppointment(target._id));
    cancelAppointment.fulfilled.match(res) ? toast.success('Appointment cancelled') : toast.error(res.payload);
    setTarget(null);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-4xl font-extrabold">My appointments</h1><p className="mt-2 opacity-70">Track, review or cancel your bookings.</p></div>
        <div className="flex gap-3">
          <div><label className="label" htmlFor="year">Year</label>
            <select id="year" className="input !w-auto" value={year} onChange={(e) => setYear(e.target.value)}>
              <option>All</option>{years.map((y) => <option key={y}>{y}</option>)}
            </select></div>
          <div><label className="label" htmlFor="status">Status</label>
            <select id="status" className="input !w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All</option><option value="booked">Booked</option><option value="cancelled">Cancelled</option>
            </select></div>
        </div>
      </div>

      {loading && !items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[...Array(3)].map((_, i) => <div key={i} className="glass h-48 animate-pulse" />)}</div>
      ) : list.length ? (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((a) => <AppointmentCard key={a._id} appointment={a} onCancel={setTarget} />)}
        </motion.div>
      ) : (
        <div className="glass p-10 text-center">
          <p className="mb-4 text-lg">{items.length ? 'No appointments match these filters.' : 'You have no appointments yet.'}</p>
          <Link to="/book" className="btn-coral">Book your first appointment</Link>
        </div>
      )}

      <AnimatePresence>
        {target && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="cancel-title">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass w-full max-w-sm space-y-4 !bg-white p-6 dark:!bg-[#0A1D21]">
              <h2 id="cancel-title" className="text-xl font-bold">Cancel this appointment?</h2>
              <p className="opacity-75">{target.doctor?.name} on {formatDate(target.date)} at {target.time}. The slot will open up for other patients.</p>
              <div className="flex gap-3">
                <button onClick={() => setTarget(null)} className="btn-ghost flex-1 !py-2.5">Keep it</button>
                <button onClick={confirmCancel} className="btn-coral flex-1 !py-2.5">Cancel appointment</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
