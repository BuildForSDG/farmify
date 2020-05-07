const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { cookieExtractor, hash } = require('./helpers');
const db = require('../db');

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET;
opts.issuer = 'https://calm-eyrie-12411.herokuapp.com';
opts.audience = 'https://farmify-develop.web.app';
passport.use(new JwtStrategy(opts, ((jwtPayload, done) => {
  db.query('SELECT * FROM users WHERE id = $1', [jwtPayload.id], (err, result) => {
    const user = result.rows[0];
    if (err)
    {
      return done(err, false);
    }
    if (user)
    {
      return done(null, user);
    }

    return done(null, false);
  });
})));

passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
((email, password, done) => {
  const hashedPassword = hash(password);
  db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, hashedPassword], (err, result) => {
    const user = result.rows[0];
    if (user) delete user.password;
    if (err)
    {
      return done(err, false);
    }
    if (user)
    {
      return done(null, user);
    }

    return done(null, false);
  });
})));
