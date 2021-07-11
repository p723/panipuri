function admin(req, res, next) {
         if (req.isAuthenticated() && req.user.role === 'admin') {
                  return next()
         }
         return res.redirect('/customer/orders')
}

module.exports = admin