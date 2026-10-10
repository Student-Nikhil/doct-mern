import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads');
fs.mkdirSync(dir, { recursive: true });
export default multer({
  storage: multer.diskStorage({
    destination: dir,
    filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`)
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) =>
    /image\/|application\/pdf/.test(file.mimetype) ? cb(null, true) : cb(new Error('Only images or PDF files are allowed'))
});
