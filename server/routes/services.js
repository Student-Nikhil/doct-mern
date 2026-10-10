import { Router } from 'express';
import Service from '../models/Service.js';
const router = Router();
router.get('/', async (_req, res, next) => {
  try { res.json(await Service.find()); } catch (e) { next(e); }
});
export default router;
