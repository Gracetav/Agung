module.exports = {
  isAuth: (req, res, next) => {
    if (req.session.userId) {
      return next();
    }
    req.flash('error_msg', 'Silakan login terlebih dahulu');
    res.redirect('/auth/login');
  },
  isAdmin: (req, res, next) => {
    if (req.session.role === 'admin') {
      return next();
    }
    req.flash('error_msg', 'Akses ditolak: Hanya Admin yang diperbolehkan');
    res.redirect('/');
  },
  isUser: (req, res, next) => {
    if (req.session.role === 'user') {
      return next();
    }
    req.flash('error_msg', 'Akses ditolak: Hanya User yang diperbolehkan');
    res.redirect('/admin/dashboard');
  }
};
