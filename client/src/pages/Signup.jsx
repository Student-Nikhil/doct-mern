import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { register } from '../store/authSlice.js';

const fields = [
  ['name', 'Full name', 'text', 'name', 'Asha Patil'],
  ['email', 'Email', 'email', 'email', 'you@example.com'],
  ['phone', 'Phone number', 'tel', 'tel', '10-digit mobile number'],
  ['password', 'Password', 'password', 'new-password', 'At least 6 characters'],
  ['confirm', 'Confirm password', 'password', 'new-password', 'Type it again']
];

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((s) => s.auth.loading);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Phone number must be 10 digits';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const { confirm, ...data } = form;
    const res = await dispatch(register(data));
    if (register.fulfilled.match(res)) { toast.success('Account created. Welcome to CareLoop!'); navigate('/dashboard', { replace: true }); }
    else toast.error(res.payload);
  };

  return (
    <section className="grid place-items-center px-4 py-12">
      <motion.form onSubmit={submit} noValidate initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-md space-y-4 p-8">
        <div><h1 className="text-3xl font-extrabold">Create your account</h1><p className="opacity-70">Book your first appointment in minutes.</p></div>
        {fields.map(([k, label, type, ac, ph]) => (
          <div key={k}>
            <label className="label" htmlFor={k}>{label}</label>
            <input id={k} type={type} autoComplete={ac} placeholder={ph} className="input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            {errors[k] && <p className="err">{errors[k]}</p>}
          </div>
        ))}
        <button className="btn-coral w-full" disabled={loading}>{loading ? 'Creating account…' : 'Sign up'}</button>
        <p className="text-center text-sm">Already registered? <Link to="/login" className="font-bold text-teal-700 underline dark:text-teal-400">Log in</Link></p>
      </motion.form>
    </section>
  );
}
