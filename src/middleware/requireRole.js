const requireRole = (...allowedRoles) => (req, res, next) => {
  const role = req.header('x-user-role');
  if (!role || !allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'Akses ditolak. Role akun Anda tidak memiliki izin untuk aksi ini.' });
  }
  next();
};

module.exports = requireRole;
