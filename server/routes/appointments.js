import { Router } from 'express';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();
router.use(auth);

router.post('/', upload.single('report'), async (req, res, next) => {
  try {
    const { doctor, date, time, illness, comments } = req.body;
    if (!doctor || !date || !time || !illness?.trim()) return res.status(400).json({ message: 'Doctor, date, time and reason are required' });
    const when = new Date(`${date}T00:00:00.000Z`);
    const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z');
    if (isNaN(when) || when < today) return res.status(400).json({ message: 'Choose today or a future date' });
    const doc = await Doctor.findById(doctor);
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    if (!doc.slots.includes(time)) return res.status(400).json({ message: 'This time slot is not offered' });
    const taken = await Appointment.findOne({ doctor, date: when, time, status: 'booked' });
    if (taken) return res.status(409).json({ message: 'That slot is already booked. Pick another time' });
    const appt = await Appointment.create({
      user: req.userId, doctor, date: when, time, illness, comments,
      report: req.file ? `/uploads/${req.file.filename}` : ''
    });
    res.status(201).json(await appt.populate('doctor'));
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    res.json(await Appointment.find({ user: req.userId }).populate('doctor').sort({ date: -1 }));
  } catch (e) { next(e); }
});

router.get('/taken', async (req, res, next) => {
  try {
    const { doctor, date } = req.query;
    const list = await Appointment.find({ doctor, date: new Date(`${date}T00:00:00.000Z`), status: 'booked' });
    res.json(list.map((a) => a.time));
  } catch (e) { next(e); }
});

router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, user: req.userId });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (appt.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });
    appt.status = 'cancelled';
    await appt.save();
    res.json(await appt.populate('doctor'));
  } catch (e) { next(e); }
});

export default router;
