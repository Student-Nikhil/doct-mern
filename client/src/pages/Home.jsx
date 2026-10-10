import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiSearch, FiCalendar, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import ServiceIcon from '../components/ServiceIcon.jsx';
import { fetchServices } from '../store/catalogSlice.js';

const stories = [
  { name: 'Priya S.', text: 'I searched "migraine", found a neurologist and had a slot for the next morning. It took under two minutes.' },
  { name: 'Rahul D.', text: 'My plans changed, so I cancelled in one tap and booked a new time. No phone calls, no waiting.' },
  { name: 'Sunita K.', text: 'I uploaded my old blood reports with the booking, so the doctor had everything before I arrived.' }
];

const faqs = [
  ['How do I book an appointment?', 'Log in, open Doctors, pick a doctor or search by illness, then choose a date and time and press Book appointment.'],
  ['Can I cancel an appointment?', 'Yes. Open My appointments and press Cancel appointment on any upcoming booking. The slot opens up for others.'],
  ['What files can I upload with my booking?', 'You can attach a report as an image or PDF up to 5 MB. Doctors see it before your visit.'],
  ['Is my information private?', 'Your profile and reports are visible only to you and the doctor you book. Your password is stored encrypted.']
];

function Stories() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % stories.length), 5000); return () => clearInterval(t); }, []);
  return (
    <div className="glass mx-auto max-w-2xl p-8 text-center">
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
          <p className="font-display text-xl font-semibold leading-snug sm:text-2xl">“{stories[i].text}”</p>
          <p className="mt-4 font-semibold text-teal-700 dark:text-teal-400">{stories[i].name}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-center gap-2">
        {stories.map((s, n) => (
          <button key={s.name} onClick={() => setI(n)} aria-label={`Show story ${n + 1}`} className={`h-2.5 rounded-full transition-all ${n === i ? 'w-8 bg-coral-500' : 'w-2.5 bg-ink/20 dark:bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map(([q, a], n) => (
        <div key={q} className="glass !rounded-2xl">
          <button onClick={() => setOpen(open === n ? -1 : n)} aria-expanded={open === n} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold">
            {q}
            <motion.span animate={{ rotate: open === n ? 180 : 0 }}><FiChevronDown /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === n && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="px-5 pb-5 opacity-75">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const services = useSelector((s) => s.catalog.services);
  const token = useSelector((s) => s.auth.token);
  useEffect(() => { dispatch(fetchServices()); }, [dispatch]);

  return (
    <>
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 lg:grid-cols-2 lg:pt-20">
        <svg aria-hidden viewBox="0 0 600 120" className="absolute inset-x-0 top-1/2 -z-10 w-full -translate-y-1/2 opacity-30" preserveAspectRatio="none">
          <path className="animate-pulseline stroke-teal-500" strokeDasharray="400" fill="none" strokeWidth="2.5" strokeLinecap="round"
            d="M0 70h180l18-40 28 80 26-60 14 20h60l18-30 26 60 16-30h215" />
        </svg>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">See the right doctor, at the time that suits you.</h1>
          <p className="mt-5 max-w-lg text-lg opacity-75">Tell us what is bothering you. CareLoop shows the doctors who treat it, with open time slots you can book or cancel in one tap.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={token ? '/doctors' : '/signup'} className="btn-coral">{token ? 'Find a doctor' : 'Create free account'} <FiArrowRight /></Link>
            <Link to="/services" className="btn-ghost">Browse services</Link>
          </div>
          <dl className="mt-10 flex gap-8">
            {[['10+', 'Specialist doctors'], ['9', 'Care services'], ['5 min', 'Average booking time']].map(([n, l]) => (
              <div key={l}><dt className="font-display text-3xl font-extrabold text-teal-700 dark:text-teal-400">{n}</dt><dd className="text-sm opacity-70">{l}</dd></div>
            ))}
          </dl>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative mx-auto w-full max-w-md">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="glass space-y-4 p-6">
            <div className="flex items-center gap-3"><FiSearch className="text-teal-600" /><span className="opacity-60">migraine for 3 days…</span></div>
            <div className="flex items-center gap-3 rounded-2xl bg-teal-700/10 p-3 dark:bg-white/10">
              <img src="https://ui-avatars.com/api/?name=Rohan+Deshmukh&background=7C3AED&color=fff&bold=true" alt="" className="h-12 w-12 rounded-xl" />
              <div><p className="font-bold">Dr. Rohan Deshmukh</p><p className="text-sm opacity-70">Neurologist · 4.8 rating</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['10:00 AM', '11:00 AM', '02:00 PM'].map((t, n) => (
                <span key={t} className={`rounded-full px-4 py-2 text-sm font-semibold ${n === 1 ? 'bg-coral-500 text-white' : 'border border-teal-900/15 dark:border-white/20'}`}>{t}</span>
              ))}
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }}
            className="glass absolute -bottom-6 -left-4 flex items-center gap-2 !rounded-2xl px-4 py-3 text-sm font-semibold sm:-left-10">
            <FiCheckCircle className="text-teal-500" /> Appointment booked
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Care for every kind of problem</h2>
        <p className="mt-2 max-w-xl opacity-70">Pick the area that matches how you feel and we will show the doctors who treat it.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <motion.div key={s._id} whileHover={{ y: -6, rotate: -0.5 }} className="glass flex gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-700 text-xl text-white dark:bg-teal-500 dark:text-ink"><ServiceIcon name={s.icon} /></span>
              <div><h3 className="font-bold">{s.title}</h3><p className="mt-1 text-sm opacity-70">{s.description}</p></div>
            </motion.div>
          ))}
        </div>
        <Link to="/services" className="mt-6 inline-flex items-center gap-2 font-semibold text-teal-700 dark:text-teal-400">See all services <FiArrowRight /></Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-8 text-3xl font-extrabold sm:text-4xl">Booked in three steps</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {[[FiSearch, 'Search by illness', 'Type a symptom or pick a doctor type.'], [FiCalendar, 'Choose a time', 'See open slots and pick the one that fits.'], [FiCheckCircle, 'Show up or cancel', 'Cancel in one tap if plans change.']].map(([Icon, t, d], n) => (
            <li key={t} className="glass p-6"><span className="font-display text-sm font-bold text-coral-500">Step {n + 1}</span><Icon className="my-3 text-3xl text-teal-600" /><h3 className="text-lg font-bold">{t}</h3><p className="opacity-70">{d}</p></li>
          ))}
        </ol>
      </section>

      <section className="px-4 py-14"><h2 className="mb-8 text-center text-3xl font-extrabold sm:text-4xl">What patients say</h2><Stories /></section>
      <section className="px-4 py-14"><h2 className="mb-8 text-center text-3xl font-extrabold sm:text-4xl">Questions, answered</h2><Faq /></section>
    </>
  );
}
