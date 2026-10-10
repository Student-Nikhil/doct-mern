import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-teal-900/10 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <Logo />
          <p className="opacity-60">Find the right doctor and book in minutes.</p>
        </div>
        <nav className="flex gap-5 font-semibold opacity-80">
          <Link to="/services">Services</Link>
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </nav>
        <p className="opacity-60">© {new Date().getFullYear()} CareLoop</p>
      </div>
    </footer>
  );
}
