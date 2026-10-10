import jwt from 'jsonwebtoken';
export default function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Please log in to continue' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret').id;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please log in again' });
  }
}
