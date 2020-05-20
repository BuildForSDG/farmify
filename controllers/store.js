/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const debug = require('debug')('farmify-server:server');
const db = require('../db');

module.exports = {
  fetchAll(req, res, next) {
    try
    {
      const {
        page, category, price, city, state,
      } = req.query;
      const offset = typeof page === 'number' ? +page * 20 : 0;
      const limit = 20;
      const errors = validationResult(req);
      priceArray = price.split(',');
      const params = [`%${category || ''}%`, price ? priceArray[0] : 0, price ? priceArray[1] : 500000, `%${city || ''}%`, `%${state || ''}%`, offset, limit];
      const query = `SELECT products.id, name, category, farmer_id, available, availability, stock, price, img_url, COUNT(*) FROM products JOIN users ON products.farmer_id = users.id WHERE products.id >= 0
               AND category LIKE $1
               AND (price >= $2 OR price <= $3)
               AND city LIKE $4
               AND state LIKE $5 
               GROUP BY products.id, users.id, name, category, farmer_id, available, availability, stock, price, img_url ORDER BY name OFFSET  $6 LIMIT  $7`;

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
          nextPage: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
            ? (nextPage ? `http://localhost:3000/store/all?page=${nextPage}${category ? `&category=${category}` : ''}${price ? `&price=${price}` : ''}${city ? `&city=${city}` : ''}${state ? `&state=${state}` : ''}` : null)
            : (nextPage ? `https://calm-eyrie-12411.herokuapp.com/products/all?page=${nextPage}${category ? `&category=${category}` : ''}${price ? `&price=${price}` : ''}${city ? `&city=${city}` : ''}${state ? `&state=${state}` : ''}` : null),
          prevPage: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
            ? (prevPage ? `http://localhost:3000/store/all?page=${prevPage}${category ? `&category=${category}` : ''}${price ? `&price=${price}` : ''}${city ? `&city=${city}` : ''}${state ? `&state=${state}` : ''}` : null)
            : (prevPage ? `https://calm-eyrie-12411.herokuapp.com/products/all?page=${prevPage}${category ? `&category=${category}` : ''}${price ? `&price=${price}` : ''}${city ? `&city=${city}` : ''}${state ? `&state=${state}` : ''}` : null),

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
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err)
        {
          fs.unlink(req.file.path, (err) => {
            if (err) debug('Unable to delete file');
            return null;
          });
          res.status(401).send({ error: 'unuthorized access' });
          return null;
        }
        if (!err && user.usertype !== 1)
        {
          fs.unlink(req.file.path, (err) => {
            if (err) debug('Unable to delete file');
            return null;
          });
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
          errors.push(req.file ? null : { product_image: 'product image is required' });
          res.status(400).send({ error: errors });
          return null;
        }
        const {
          name, category, farmer_id, availability, available, stock, price,
        } = req.body;
        const filePath = req.file.path.replace(new RegExp(`[\\${path.sep}]`, 'g'), '/').match(/public[/\w+-\d+.]+/g)[0];
        const img_url = `https://calm-eyrie-12411.herokuapp.com/${filePath}`;
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
