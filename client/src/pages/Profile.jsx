import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiCamera } from 'react-icons/fi';
import { Avatar } from '../components/Navbar.jsx';
import { updateProfile } from '../store/authSlice.js';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: user.name || '', phone: user.phone || '', age: user.age || '', gender: user.gender || '', address: user.address || '' });
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const preview = avatar ? { ...user, avatar: null } : user;

  const submit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Enter your full name';
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Phone number must be 10 digits';
    if (form.age && (form.age < 0 || form.age > 120)) e.age = 'Enter a valid age';
    setErrors(e);
    if (Object.keys(e).length) return;
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (avatar) fd.append('avatar', avatar);
    const res = await dispatch(updateProfile(fd));
    updateProfile.fulfilled.match(res) ? toast.success('Profile saved') : toast.error(res.payload);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-extrabold">My profile</h1>
      <form onSubmit={submit} noValidate className="glass grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <div className="flex items-center gap-4 sm:col-span-2">
          {avatar ? <img src={URL.createObjectURL(avatar)} alt="" className="h-24 w-24 rounded-full object-cover" /> : <Avatar user={preview} size="h-24 w-24 text-3xl" />}
          <label className="btn-ghost cursor-pointer !py-2"><FiCamera /> Change photo
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => setAvatar(e.target.files[0] || null)} />
          </label>
        </div>
        <div><label className="label" htmlFor="pname">Full name</label><input id="pname" className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />{errors.name && <p className="err">{errors.name}</p>}</div>
        <div><label className="label" htmlFor="pemail">Email</label><input id="pemail" className="input opacity-60" value={user.email} disabled /></div>
        <div><label className="label" htmlFor="pphone">Phone number</label><input id="pphone" className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} />{errors.phone && <p className="err">{errors.phone}</p>}</div>
        <div><label className="label" htmlFor="page">Age</label><input id="page" type="number" className="input" value={form.age} onChange={(e) => set('age', e.target.value)} />{errors.age && <p className="err">{errors.age}</p>}</div>
        <div><label className="label" htmlFor="pgender">Gender</label>
          <select id="pgender" className="input" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
            <option value="">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
          </select></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="paddr">Address</label><textarea id="paddr" rows={2} className="input" value={form.address} onChange={(e) => set('address', e.target.value)} /></div>
        <button className="btn-primary sm:col-span-2" disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</button>
      </form>
    </section>
  );
}
