const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { cookieExtractor, hash } = require('./helpers');
const db = require('../db');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
((email, password, done) => {
  const hashedPassword = hash(password);
  db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, hashedPassword], (err, result) => {
    if (err)
    {
      return done(err, false);
    }
    const user = result ? result.rows[0] : null;
    if (user) delete user.password;
    if (user)
    {
      return done(null, user);
    }

    return done(null, false);
  });
})));

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET;
// opts.issuer = process.env.NODE_ENV === 'development' ? undefined : 'https://calm-eyrie-12411.herokuapp.com';
// opts.audience = process.env.NODE_ENV === 'development' ? undefined : 'https://farmify-develop.web.app';
passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
  db.query('SELECT * FROM users WHERE id = $1', [jwtPayload.id], (err, result) => {
    if (err)
    {
      return done(err, false);
    }
    const user = result ? result.rows[0] : null;
    if (user)
    {
      return done(null, user);
    }

    return done(null, false);
  });
}));

module.exports = {
  initialize() {
    return passport.initialize();
  },
};
