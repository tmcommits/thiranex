import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'supersecretkeyfortaskmanagementapp123';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Contains id, username, email
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
