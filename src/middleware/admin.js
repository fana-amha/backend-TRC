module.exports = function(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }

  next();
};
