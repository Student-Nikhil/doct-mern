import { useSearchParams } from 'react-router-dom';
import DoctorsExplorer from '../components/DoctorsExplorer.jsx';

export default function Doctors() {
  const [params] = useSearchParams();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-extrabold">Find a doctor</h1>
      <p className="mb-8 mt-2 opacity-70">Search by name, doctor type or the illness you want help with.</p>
      <DoctorsExplorer initialSpecialty={params.get('specialty') || 'All'} />
    </section>
  );
}
