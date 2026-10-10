import { Router } from 'express';
import Doctor from '../models/Doctor.js';
import auth from '../middleware/auth.js';
const router = Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const { specialty, search } = req.query;
    const q = {};
    if (specialty && specialty !== 'All') q.specialty = specialty;
    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      q.$or = [{ name: rx }, { specialty: rx }, { treats: rx }];
    }
    res.json(await Doctor.find(q).sort({ rating: -1 }));
  } catch (e) { next(e); }
});

router.get('/specialties', auth, async (_req, res, next) => {
  try { res.json(await Doctor.distinct('specialty')); } catch (e) { next(e); }
});

export default router;
