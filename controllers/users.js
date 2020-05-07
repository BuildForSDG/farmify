/* eslint-disable no-shadow */
const { validationResult } = require('express-validator');
const passport = require('passport');
const debug = require('debug')('farmify-server:server');
const db = require('../db');
const { hash, generateToken } = require('../lib/helpers');


module.exports = {
  register: (req, res, next) =>
  {
    try
    {
      const {
        firstName, lastName, email, phone, password, address, city, state, country, userType,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty())
      {
        res.status(422).send({ error: errors.array() });
      }
      else
      {
        const hashedPassword = hash(password);
        if (hashedPassword)
        {
          db.query(`INSERT INTO users (firstName, lastName, email, phone, password, address, city, state, country, userType)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [firstName, lastName, email, phone, hashedPassword, address, city, state,
            country, userType],
          (err, response) => {
            if (err)
            {
              debug(err);
              res.status(500).send({ error: 'Error occured while creating the account' });
              return;
            }
            res.status(200).send({ success: 'registration successful' });
          });
        }
        else
        {
          res.status(500).send({ error: 'Error occured while creating the account' });
          return;
        }
      }
    }
    catch (err)
    {
      debug(err);
      res.status(500).send({
        error: 'An internal server error occured',
      });
    }
  },
  login(req, res, next) {
    try
    {
      passport.authenticate('local', (err, user, info) => {
        if (err)
        {
          return res.status(500).send({ error: 'Unable to verify user at this time' });
        }
        if (user)
        {
          generateToken(res, user.id, user.firstName);
          return res.status(200).send({ user });
        }

        return res.status(401).send({ error: 'Invalid username or password' });
      })(req, res, next);
    }
    catch (err)
    {
      debug(err);
      res.status(500).send({
        error: 'An internal server error occured',
      });
    }
  },
};
