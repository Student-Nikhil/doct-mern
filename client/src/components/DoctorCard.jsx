import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiBriefcase } from 'react-icons/fi';

export default function DoctorCard({ doctor }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="glass group flex flex-col gap-4 p-5">
      <div className="flex items-center gap-4">
        <img src={doctor.image} alt={doctor.name} loading="lazy" className="h-16 w-16 rounded-2xl object-cover ring-2 ring-teal-500/40 transition group-hover:scale-105" />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{doctor.name}</h3>
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">{doctor.specialty}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {doctor.treats?.slice(0, 3).map((t) => (
          <span key={t} className="rounded-full bg-teal-700/10 px-3 py-1 text-xs font-semibold text-teal-800 dark:bg-white/10 dark:text-teal-100">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm opacity-80">
        <span className="inline-flex items-center gap-1"><FiStar className="text-coral-500" /> {doctor.rating}</span>
        <span className="inline-flex items-center gap-1"><FiBriefcase /> {doctor.experience} yrs</span>
        <span className="font-bold">₹{doctor.fee}</span>
      </div>
      <Link to={`/book?doctor=${doctor._id}`} className="btn-primary mt-auto !py-2.5">Book appointment</Link>
    </motion.article>
  );
}
