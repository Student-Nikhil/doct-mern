import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiFileText, FiXCircle } from 'react-icons/fi';
import { formatDate } from '../utils/helpers.js';
import { fileUrl } from '../utils/api.js';

export default function AppointmentCard({ appointment, onCancel }) {
  const { doctor, date, time, illness, comments, report, status } = appointment;
  const cancelled = status === 'cancelled';
  const past = !cancelled && new Date(date) < new Date(new Date().toISOString().slice(0, 10));

  return (
    <motion.article layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -4 }}
      className={`glass flex flex-col gap-3 p-5 ${cancelled ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3">
        <img src={doctor?.image} alt="" className="h-14 w-14 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold">{doctor?.name}</h3>
          <p className="text-sm text-teal-700 dark:text-teal-400">{doctor?.specialty}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${cancelled ? 'bg-coral-500/15 text-coral-600' : past ? 'bg-ink/10 dark:bg-white/10' : 'bg-teal-500/20 text-teal-800 dark:text-teal-300'}`}>
          {cancelled ? 'Cancelled' : past ? 'Completed' : 'Upcoming'}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
        <span className="inline-flex items-center gap-1.5"><FiCalendar /> {formatDate(date)}</span>
        <span className="inline-flex items-center gap-1.5"><FiClock /> {time}</span>
      </div>
      <p className="text-sm"><span className="font-semibold">Reason:</span> {illness}</p>
      {comments && <p className="text-sm opacity-70">{comments}</p>}
      {report && (
        <a href={fileUrl(report)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 underline dark:text-teal-400">
          <FiFileText /> View uploaded report
        </a>
      )}
      {!cancelled && !past && (
        <button onClick={() => onCancel(appointment)} className="btn-ghost mt-1 !border-coral-500/40 !py-2 !text-coral-600 hover:!bg-coral-500/10">
          <FiXCircle /> Cancel appointment
        </button>
      )}
    </motion.article>
  );
}
