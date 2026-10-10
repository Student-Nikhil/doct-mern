import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ServiceIcon from '../components/ServiceIcon.jsx';
import { fetchServices } from '../store/catalogSlice.js';

export default function Services() {
  const dispatch = useDispatch();
  const services = useSelector((s) => s.catalog.services);
  const token = useSelector((s) => s.auth.token);
  useEffect(() => { dispatch(fetchServices()); }, [dispatch]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-extrabold">Our services</h1>
      <p className="mt-2 max-w-xl opacity-70">Every service is linked to specialist doctors. Choose one to see who can help.</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.article key={s._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }} className="glass flex flex-col gap-3 p-6">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-700 text-2xl text-white dark:bg-teal-500 dark:text-ink"><ServiceIcon name={s.icon} /></span>
            <h2 className="text-xl font-bold">{s.title}</h2>
            <p className="flex-1 opacity-70">{s.description}</p>
            <Link to={token ? `/doctors?specialty=${encodeURIComponent(s.specialty)}` : '/login'} className="btn-ghost !py-2">
              {token ? `See ${s.specialty}s` : 'Log in to book'}
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
