const User = require('../../models/user')
const passport = require("passport");

//const bcrypt = require('bcrypt')
function authController() {
       const _getRedirectUrl = (req) => {
                return req.user.rule === 'admin' ? '/admin/orders': '/customer/orders';
       }
         return {
                  login(req, res) {
                           return res.render('auth/login')
                  },
                  postLogin(req, res, next) {
                           passport.authenticate('local', (err, user, info) => {
                                    if (err) {
                                             req.flash('error', info.message)
                                             return next(err)
                                    }
                                    if (!user) {
                                             req.flash('error', info.message)
                                             return res.redirect('/login')
                                    }
                                    req.logIn(user, (err) => {
                                             if (err) {
                                                      req.flash('error', info.message)
                                                      return next(err)
                                             }
                                             return res.redirect(_getRedirectUrl(req))
                                    })
                           })(req, res, next)
                  },
                  register(req, res) {
                           return res.render('auth/register')
                  },
                  async postRegister(req, res) {
                           const {
                                    name,
                                    email,
                                    password
                           } = req.body;
                           if (!name || !email || !password) {
                                    req.flash('error', 'All fields are required')
                                    req.flash('name', name)
                                    req.flash('email', email)
                                    return res.redirect('/register')
                           }

                           //check email existing
                           User.exists({
                                    email: email
                           }, (err, result) => {
                                    if (result) {
                                             req.flash('error', 'Email already exists')
                                             req.flash('name', name)
                                             req.flash('email', email)
                                             return res.redirect('/register')
                                    }
                           })
                           //HASH password

                         //  const hashedPassword = await bcrypt.hash(password,10);

                           // create a user
                           const user = new User({
                                    name,
                                    email,
                                    password
                           })

                           user.save().then((user) => {
                                    //Login
                                    req.flash('success', "Your now registered..!, Now login to your account..!")
                                    return res.redirect('/login')
                           }).catch(err => {
                                    req.flash('error', 'Something went worng..!')
                                    return res.redirect('/register')
                           })
                  },
                  logout(req,
                           res) {
                           req.logout()
                           return res.redirect('/login')
                  }
         }
}
module.exports = authController