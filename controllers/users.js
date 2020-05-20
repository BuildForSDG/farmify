/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-shadow */
const { validationResult } = require('express-validator');
const passport = require('passport');
const debug = require('debug')('farmify-server:server');
const db = require('../db');
const { hash, generateToken } = require('../lib/helpers');

module.exports = {
  register(req, res, next) {
    try
    {
      const {
        firstname, lastname, email, phone, password, address, city, state, country, usertype,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty())
      {
        res.status(400).send({ status: 400, error: errors.array() });
      }
      else
      {
        const hashedPassword = hash(password);
        if (hashedPassword)
        {
          db.query(`INSERT INTO users (firstname, lastname, email, phone, password, address, city, state, country, usertype)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [firstname, lastname, email, phone, hashedPassword, address, city, state,
            country, usertype],
          (err, response) => {
            if (err)
            {
              console.log(err);
              res.status(500).send({ status: 500, error: 'Error occured while creating the account' });
              return;
            }
            res.status(200).send({ status: 200, success: 'registration successful' });
          });
        }
        else
        {
          res.status(500).send({ status: 500, error: 'Error occured while creating the account' });
          return;
        }
      }
    }
    catch (err)
    {
      console.log(err);
      res.status(500).send({
        status: 500,
        error: 'An internal server error occured',
      });
    }
  },
  updateUser(req, res, next) {
    try
    {
      passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err)
        {
          res.status(401).send({ status: 401, error: 'Unauthorized user' });
          return null;
        }
        if (!user)
        {
          res.status(400).send({ status: 400, error: 'Authorization cookie not found in request' });
          return null;
        }
        const {
          firstname, lastname, email, phone, address, city, state, country, usertype,
        } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
          res.status(400).send({ status: 400, error: errors.array() });
        }
        else
        {
          db.query(`UPDATE users SET firstname = $1, lastname = $2, email = $3, phone = $4, 
            address = $5, city = $6, state = $7, country = $8, usertype = $9
            WHERE id = $10`,
          [firstname, lastname, email, phone, address, city, state,
            country, usertype, user.id],
          (err, response) => {
            if (err)
            {
              console.log(err);
              res.status(500).send({ status: 500, error: 'Error occured while updating the account' });
              return;
            }
            res.status(200).send({ status: 200, success: 'update successful' });
          });
        }
      })(req, res, next);
    }
    catch (err)
    {
      console.log(err);
      res.status(500).send({
        status: 500,
        error: 'An internal server error occured',
      });
    }
  },
  login(req, res, next) {
    try
    {
      const errors = validationResult(req);
      if (!errors.isEmpty())
      {
        return res.status(400).send({ status: 400, error: errors.array() });
      }
      passport.authenticate('local', (err, user, info) => {
        if (err)
        {
          return res.status(500).send({ status: 500, error: 'Unable to verify user at this time' });
        }
        if (user)
        {
          generateToken(res, user.id, user.firstName);
          return res.status(200).send({ status: 200, user });
        }

        return res.status(401).send({ status: 400, error: 'Invalid username or password' });
      })(req, res, next);
      return null;
    }
    catch (err)
    {
      debug(err);
      res.status(500).send({
        status: 500,
        error: 'An internal server error occured',
      });
      return null;
    }
  },

  addFarmer(req, res, next) {
    try
    {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err)
        {
          res.status(401).send({ statys: 401, error: 'Unauthorized user' });
          return null;
        }
        if (!user)
        {
          res.status(400).send({ status: 400, error: 'Authentication Cookie not found in request' });
          return null;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
          res.status(400).send({ status: 400, error: errors.array() });
          return null;
        }
        const {
          farm_name, farm_capacity, product_names,
        } = req.body;
        const product_names_sql_arr = product_names.reduce((str = '', el) => `${str},"${el}"`);
        const query = `INSERT INTO farmers (user_id, farm_name, farm_capacity, product_names) 
        VALUES ($1, $2, $3, $4)`;
        db.query(query,
          [user.id, farm_name, farm_capacity, `{${product_names_sql_arr}}`],
          (error, results) => {
            if (error)
            {
              debug(error);
              res.status(500).send({ status: 500, error: 'Unknown error encountered while adding farmer or user already has a farmer account' });
              return null;
            }
            res.status(204).send({ status: 204, success: 'Please wait for verification approval to start uploading products' });
            return null;
          });
      })(req, res, next);
    }
    catch (err)
    {
      debug(err);
      res.status(500).send({ status: 500, error: 'An unknown error occured' });
    }
  },
  updateFarmer(req, res, next) {
    try
    {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err)
        {
          res.status(401).send({ statys: 401, error: 'Unauthorized user' });
          return null;
        }
        if (!user)
        {
          res.status(400).send({ status: 400, error: 'Authentication Cookie not found in request' });
          return null;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
          res.status(400).send({ status: 400, error: errors.array() });
          return null;
        }
        const {
          farm_name, farm_capacity, product_names,
        } = req.body;
        const product_names_sql_arr = product_names.reduce((str = '', el) => `${str},"${el}"`);
        const query = `UPDATE farmers SET farm_name = $1, farm_capacity = $2, product_names = $3 
        WHERE user_id = $4`;
        db.query(query,
          [farm_name, farm_capacity, `{${product_names_sql_arr}}`, user.id],
          (error, results) => {
            if (error)
            {
              console.log(error);
              res.status(500).send({ status: 500, error: 'Unknown error encountered while updating farmer account' });
              return null;
            }
            res.status(204).send({ status: 204, success: 'Farmer updated successfully' });
            return null;
          });
      })(req, res, next);
    }
    catch (err)
    {
      debug(err);
      res.status(500).send({ status: 500, error: 'An unknown error occured' });
    }
  },
};
