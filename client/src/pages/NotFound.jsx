import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <section className="grid place-items-center px-4 py-24 text-center">
      <h1 className="font-display text-7xl font-extrabold text-coral-500">404</h1>
      <p className="mb-6 mt-2 text-lg">We could not find that page.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </section>
  );
}
