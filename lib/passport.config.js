const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { cookieExtractor, hash } = require('../lib/helpers');
const db = require('../db');

const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET;
opts.issuer = 'https://calm-eyrie-12411.herokuapp.com';
opts.audience = 'https://farmify-develop.web.app';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    db.query('SELECT * FROM users WHERE id = $1',[jwt_payload.id], function(err, result){
        user = result.rows[0];
        if(err)
        {
            return done(err, false);
        }
        if(user)
        {
            return done(null, user);
        }
        else 
        {
            return done(null, false);
        }
    })
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
  function(email, password, done) {
    const hashedPassword = hash(password)
    db.query('SELECT * FROM users WHERE email = $1 AND password = $2',[email, hashedPassword], function(err, result){
        user = result.rows[0];
        if(user) delete user.password;
        if(err)
        {
            return done(err, false);
        }
        if(user)
        {
            return done(null, user);
        }
        else 
        {
            return done(null, false);
        }
    })
  }
));


