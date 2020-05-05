/* eslint-disable no-shadow */
const { validationResult } = require('express-validator');
const debug = require('debug')('farmify-server:server');
const db = require('../db');
const { hash } = require('../lib/helpers');


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
        res.status(422).send({ errors: errors.array() });
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
              res.status(500).send({ errors: 'Error occured while creating the account' });
              return;
            }
            res.sendStatus(204);
          });
        }
        else
        {
          res.status(500).send({ errors: 'Error occured while creating the account' });
          return;
        }
      }
    }
    catch (err)
    {
      debug(err);
      res.status(500).send({
        errors: 'An internal server error occured',
      });
    }
  },
};
