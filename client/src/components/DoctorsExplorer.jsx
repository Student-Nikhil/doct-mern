import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import DoctorCard from './DoctorCard.jsx';
import { fetchDoctors, fetchSpecialties } from '../store/catalogSlice.js';

export default function DoctorsExplorer({ limit, initialSpecialty = 'All' }) {
  const dispatch = useDispatch();
  const { doctors, specialties, loading, error } = useSelector((s) => s.catalog);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchSpecialties()); }, [dispatch]);
  useEffect(() => {
    const t = setTimeout(() => dispatch(fetchDoctors({ specialty, search })), 250);
    return () => clearTimeout(t);
  }, [dispatch, specialty, search]);

  const list = limit ? doctors.slice(0, limit) : doctors;

  return (
    <div>
      <div className="relative mb-4">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
        <input className="input !pl-11" placeholder="Search by doctor, specialty or illness, e.g. migraine" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search doctors" />
      </div>
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2" role="tablist" aria-label="Filter by doctor type">
        {['All', ...specialties].map((s) => (
          <button key={s} role="tab" aria-selected={specialty === s} onClick={() => setSpecialty(s)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${specialty === s ? 'border-transparent bg-teal-700 text-white dark:bg-teal-500 dark:text-ink' : 'border-teal-900/15 hover:bg-teal-700/10 dark:border-white/15 dark:hover:bg-white/10'}`}>
            {s}
          </button>
        ))}
      </div>
      {error && <p className="err">{error}</p>}
      {loading && !doctors.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="glass h-52 animate-pulse" />)}
        </div>
      ) : list.length ? (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((d) => <DoctorCard key={d._id} doctor={d} />)}
        </motion.div>
      ) : (
        <p className="glass p-8 text-center">No doctors match your search. Try a different illness or clear the filter.</p>
      )}
    </div>
  );
}
