const passport    = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

var User = require('../models/user')

// boilerplate for configuring passport
const init = () => {
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  passport.use(new JWTStrategy({
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
          secretOrKey   : process.env.JWT_SECRET
      },
      function (jwtPayload, cb) {

          //find the user in db if needed
          return User.findById(jwtPayload.id)
              .then(user => {
                  return cb(null, user);
              })
              .catch(err => {
                  return cb(err);
              });
      }
  ));
}

module.exports = {init}
