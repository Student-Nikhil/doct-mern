export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-xl font-extrabold ${className}`}>
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden>
        <rect width="40" height="40" rx="12" className="fill-teal-700 dark:fill-teal-500" />
        <path d="M6 21h8l3-8 5 15 4-11 2 4h6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      CareLoop
    </span>
  );
}
