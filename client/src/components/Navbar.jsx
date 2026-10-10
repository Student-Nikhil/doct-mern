import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMenu, FiX, FiLogOut, FiUser, FiHome, FiCalendar, FiPlusCircle, FiUsers, FiActivity } from 'react-icons/fi';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { logout } from '../store/authSlice.js';
import { fileUrl } from '../utils/api.js';
import { initials } from '../utils/helpers.js';

const privateLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/doctors', label: 'Doctors', icon: FiUsers },
  { to: '/services', label: 'Services', icon: FiActivity },
  { to: '/book', label: 'Book an appointment', icon: FiPlusCircle },
  { to: '/appointments', label: 'My appointments', icon: FiCalendar },
  { to: '/profile', label: 'My profile', icon: FiUser }
];

export function Avatar({ user, size = 'h-10 w-10' }) {
  return user?.avatar ? (
    <img src={fileUrl(user.avatar)} alt="" className={`${size} rounded-full object-cover`} />
  ) : (
    <span className={`${size} grid place-items-center rounded-full bg-coral-500 font-bold text-white`}>{initials(user?.name)}</span>
  );
}

export default function Navbar() {
  const { user, token } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doLogout = () => {
    dispatch(logout()); setOpen(false); toast.success('You are logged out'); navigate('/');
  };
  const linkCls = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-teal-900/10 bg-porcelain/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#071417]/70">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          {token && (
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full text-xl hover:bg-teal-700/10 dark:hover:bg-white/10">
              <FiMenu />
            </button>
          )}
          <Link to={token ? '/dashboard' : '/'}><Logo /></Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {token ? (
              <>
                <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>
                <NavLink to="/doctors" className={linkCls}>Doctors</NavLink>
                <NavLink to="/services" className={linkCls}>Services</NavLink>
                <NavLink to="/book" className={linkCls}>Book an appointment</NavLink>
                <NavLink to="/appointments" className={linkCls}>My appointments</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/" end className={linkCls}>Home</NavLink>
                <NavLink to="/services" className={linkCls}>Services</NavLink>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {token ? (
              <Link to="/profile" aria-label="My profile"><Avatar user={user} /></Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost hidden !py-2 sm:inline-flex">Log in</Link>
                <Link to="/signup" className="btn-primary !py-2">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85%] flex-col gap-2 bg-porcelain p-5 shadow-2xl dark:bg-[#0A1D21]"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="ml-auto grid h-9 w-9 place-items-center rounded-full hover:bg-teal-700/10 dark:hover:bg-white/10"><FiX /></button>
              <div className="flex flex-col items-center gap-2 pb-4 text-center">
                <Avatar user={user} size="h-20 w-20 text-2xl" />
                <p className="font-display text-lg font-bold">{user?.name}</p>
                <p className="text-sm opacity-60">{user?.email}</p>
              </div>
              {privateLinks.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={() => setOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${isActive ? 'bg-teal-700 text-white dark:bg-teal-500 dark:text-ink' : 'hover:bg-teal-700/10 dark:hover:bg-white/10'}`}>
                  <Icon /> {label}
                </NavLink>
              ))}
              <button onClick={doLogout} className="mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-coral-600 hover:bg-coral-500/10">
                <FiLogOut /> Log out
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
