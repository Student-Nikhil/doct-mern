import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiUploadCloud } from 'react-icons/fi';
import api from '../utils/api.js';
import { fetchDoctors, fetchSpecialties } from '../store/catalogSlice.js';
import { bookAppointment } from '../store/appointmentsSlice.js';
import { todayISO } from '../utils/helpers.js';

export default function Book() {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctors, specialties } = useSelector((s) => s.catalog);
  const saving = useSelector((s) => s.appointments.saving);

  const [form, setForm] = useState({ specialty: 'All', doctor: params.get('doctor') || '', date: '', time: '', illness: '', comments: '' });
  const [file, setFile] = useState(null);
  const [taken, setTaken] = useState([]);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => { dispatch(fetchSpecialties()); dispatch(fetchDoctors({})); }, [dispatch]);

  const doctor = useMemo(() => doctors.find((d) => d._id === form.doctor), [doctors, form.doctor]);
  useEffect(() => { if (doctor && form.specialty === 'All') set('specialty', doctor.specialty); }, [doctor]); // eslint-disable-line

  useEffect(() => {
    if (!form.doctor || !form.date) return setTaken([]);
    api.get('/appointments/taken', { params: { doctor: form.doctor, date: form.date } }).then((r) => setTaken(r.data)).catch(() => setTaken([]));
  }, [form.doctor, form.date]);

  const options = form.specialty === 'All' ? doctors : doctors.filter((d) => d.specialty === form.specialty);

  const validate = () => {
    const e = {};
    if (!form.doctor) e.doctor = 'Choose a doctor';
    if (!form.date) e.date = 'Choose a date';
    else if (form.date < todayISO()) e.date = 'Choose today or a later date';
    if (!form.time) e.time = 'Choose a time slot';
    if (form.illness.trim().length < 3) e.illness = 'Tell the doctor what you need help with';
    if (file && file.size > 5 * 1024 * 1024) e.file = 'File must be under 5 MB';
    if (file && !/image\/|application\/pdf/.test(file.type)) e.file = 'Upload an image or PDF';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    ['doctor', 'date', 'time', 'illness', 'comments'].forEach((k) => fd.append(k, form[k]));
    if (file) fd.append('report', file);
    const res = await dispatch(bookAppointment(fd));
    if (bookAppointment.fulfilled.match(res)) { toast.success('Appointment booked!'); navigate('/appointments'); }
    else toast.error(res.payload);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-extrabold">Book an appointment</h1>
      <p className="mb-8 mt-2 opacity-70">Choose a doctor, a day and a time. You can cancel later from My appointments.</p>
      <form onSubmit={submit} noValidate className="glass grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <label className="label" htmlFor="specialty">Type of doctor</label>
          <select id="specialty" className="input" value={form.specialty} onChange={(e) => { set('specialty', e.target.value); set('doctor', ''); set('time', ''); }}>
            <option value="All">All types</option>
            {specialties.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="doctor">Doctor</label>
          <select id="doctor" className="input" value={form.doctor} onChange={(e) => { set('doctor', e.target.value); set('time', ''); }}>
            <option value="">Select a doctor</option>
            {options.map((d) => <option key={d._id} value={d._id}>{d.name} (₹{d.fee})</option>)}
          </select>
          {errors.doctor && <p className="err">{errors.doctor}</p>}
        </div>
        <div>
          <label className="label" htmlFor="date">Date</label>
          <input id="date" type="date" min={todayISO()} className="input" value={form.date} onChange={(e) => { set('date', e.target.value); set('time', ''); }} />
          {errors.date && <p className="err">{errors.date}</p>}
        </div>
        <div>
          <label className="label" htmlFor="illness">Illness or reason</label>
          <input id="illness" className="input" placeholder="e.g. Migraine for 3 days" value={form.illness} onChange={(e) => set('illness', e.target.value)} />
          {errors.illness && <p className="err">{errors.illness}</p>}
        </div>

        <div className="sm:col-span-2">
          <span className="label">Time slot</span>
          {doctor && form.date ? (
            <div className="flex flex-wrap gap-2">
              {doctor.slots.map((t) => {
                const busy = taken.includes(t);
                return (
                  <button type="button" key={t} disabled={busy} onClick={() => set('time', t)} aria-pressed={form.time === t}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 ${form.time === t ? 'border-transparent bg-coral-500 text-white' : 'border-teal-900/20 hover:bg-teal-700/10 dark:border-white/20 dark:hover:bg-white/10'}`}>
                    {t}
                  </button>
                );
              })}
            </div>
          ) : <p className="text-sm opacity-60">Choose a doctor and a date to see open slots.</p>}
          {errors.time && <p className="err">{errors.time}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="comments">Additional comments (optional)</label>
          <textarea id="comments" rows={3} className="input" value={form.comments} onChange={(e) => set('comments', e.target.value)} maxLength={500} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-teal-700/30 p-4 transition hover:bg-teal-700/5 dark:border-white/20">
            <FiUploadCloud className="text-2xl text-teal-600" />
            <span className="text-sm font-semibold">{file ? file.name : 'Upload a report (image or PDF, up to 5 MB)'}</span>
            <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => setFile(e.target.files[0] || null)} />
          </label>
          {errors.file && <p className="err">{errors.file}</p>}
        </div>
        <button className="btn-coral sm:col-span-2" disabled={saving}>{saving ? 'Booking…' : 'Book appointment'}</button>
      </form>
    </section>
  );
}
