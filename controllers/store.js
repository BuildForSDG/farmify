/* eslint-disable no-shadow */
/* eslint-disable camelcase */
const { validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const debug = require('debug')('farmify-server:server');
const db = require('../db');

module.exports = {
  fetchAll(req, res, next) {
    try
    {
      const { page, filter } = req.query;
      const offset = typeof page === 'number' ? +page * 20 : 0;
      const limit = 20;
      const errors = validationResult(req);
      let query;
      let params = [filter, offset, limit];
      if (errors.isEmpty())
      {
        query = 'SELECT *, COUNT(*) FROM products WHERE category in ($1)  GROUP BY id, name, category, farmer_id, available, availability, stock, price, img_url ORDER BY name OFFSET  $2 LIMIT  $3';
      }
      else
      {
        params = [offset, limit];
        query = 'SELECT *, COUNT(*) FROM products GROUP BY id, name, category, farmer_id, available, availability, stock, price, img_url ORDER BY name OFFSET $1 LIMIT  $2';
      }
      db.query(query, params, (err, result) => {
        if (err)
        {
          console.log(err);
          res.status(500).send({ error: 'An unknown error occurred while fetching products' });
          return null;
        }
        const nextPage = result.rowCount >= offset + limit ? (offset / 20) + 1 : null;
        const prevPage = offset <= 0 ? null : (offset / 20) - 1;
        res.setHeader('ContentType', 'application/json');
        res.status(200).send({
          data: result.rows,
          nextPage: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? `http://localhost:3000/store/all?page=${nextPage}&filter=${filter}`
            : `https://calm-eyrie-12411.herokuapp.com/products/all?page=${nextPage}&filter=${filter}`,
          prevPage: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? `http://localhost:3000/store/all?page=${prevPage}&filter=${filter}`
            : `https://calm-eyrie-12411.herokuapp.com/products/all?page=${prevPage}&filter=${filter}`,

        });
        return null;
      });
    }
    catch (err)
    {
      debug(err);
      console.log(err);
      res.status(500).send({ error: 'An unknown error occurred while fetching products' });
    }
  },

  // eslint-disable-next-line consistent-return
  postProduct(req, res, next) {
    try
    {
      passport.authenticate('jwt', (err, user, info) => {
        if (err)
        {
          fs.unlink(req.file.path, (err) => {
            if (err) debug('Unable to delete file');
            return null;
          });
          res.status(401).send({ error: 'unuthorized access' });
          return null;
        }
        if (!err && user.userType !== 1)
        {
          res.status(401).send({ error: 'Only farmers can upload products' });
          return null;
        }
        let errors = validationResult(req);
        if (!errors.isEmpty() || !req.file)
        {
          fs.unlink(req.file.path, (err) => {
            if (err) debug('Unable to delete file');
            return null;
          });
          errors = errors.array();
          errors.push(req.file ? null : { productImage: 'product image is required' });
          res.status(400).send({ error: errors });
          return null;
        }
        const {
          name, category, farmer_id, availability, available, stock, price,
        } = req.body;
        const img_url = `https://calm-eyrie-12411.herokuapp.com/${req.file.path}`;
        res.setHeader('Content-Type', 'application/json');
        db.query('INSERT INTO products (name, category, farmer_id, available, availability, stock, price, img_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [name, category, farmer_id, available, availability, stock, price, img_url],
          (err, result) => {
            if (err)
            {
              fs.unlink(req.file.path, (err) => {
                if (err) debug('Unable to delete file');
                return null;
              });
              res.status(500).send({ error: 'An error occured while adding new products' });
              return null;
            }
            res.sendStatus(204);
            return null;
          });
        return null;
      })(req, res, next);
    }
    catch (err)
    {
      debug(err);
      console.log(err);
      fs.unlink(req.file.path, (err) => {
        if (err) debug('Unable to delete file');
        return null;
      });
      res.status(500).send({ error: 'An unknown error occurred while adding new product' });
      return null;
    }
  },

  searchProduct(req, res, next) {
    try
    {
      res.status(200).send('Coming soon');
    }
    catch (err)
    {
      debug(err);
      res.status(500).send({ error: 'Search encountered an unknown error' });
    }
  },
};
