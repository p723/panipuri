const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
//const bcrypt = require('bcrypt')

function init(passport) {
         passport.use(new LocalStrategy({
                  usernameField: 'email'
         }, async (email, password, done) => {
                  // login

                  //find user email exist
                  const user = await User.findOne({
                           email: email
                  })
                  if (!user) {
                           done(null, false, {
                                    message: "no user found with this email!"
                           })
                  }

                  /*  bcrypt.compare(password, user.password).then(match => {
            if(match) {
                return done(null, user, { message: 'Logged in succesfully' })
            }
            return done(null, false, { message: 'Wrong username or password' })
        }).catch(err => {
            return done(null, false, { message: 'Something went wrong' })
        })*/
                  const passwordServer = user.password;
                  if (password == passwordServer) {
                           return done(null, user, {
                                    message: 'Logged in succesfully'
                           })
                  } else {
                           return done(null, false, {
                                    message: 'Wrong username or password'
                           })
                  }
         }))

         passport.serializeUser((user,
                  done) => {
                  done(null,
                           user._id)
         })

         passport.deserializeUser((id,
                  done) => {
                  User.findById(id,
                           (err, user) => {
                                    done(err, user)
                           })
         })

}

module.exports = init