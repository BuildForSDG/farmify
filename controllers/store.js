/* eslint-disable camelcase */
const { validationResult } = require('express-validator');
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
        query = 'SELECT *, COUNT(*) FROM products WHERE category in ($1)  GROUP BY id, name, category, farmer_id, available, availability, stock, price ORDER BY name OFFSET  $2 LIMIT  $3';
      }
      else
      {
        params = [offset, limit];
        query = 'SELECT *, COUNT(*) FROM products GROUP BY id, name, category, farmer_id, available, availability, stock, price ORDER BY name OFFSET $1 LIMIT  $2';
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
            : `https://?page=${nextPage}&filter=${filter}`,
          prevPage: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? `http://localhost:3000/store/all?page=${prevPage}&filter=${filter}`
            : `https://?page=${prevPage}&filter=${filter}`,

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

  postProduct(req, res, next) {
    try
    {
      const errors = validationResult(req);
      if (!errors.isEmpty())
      {
        res.status(400).send({ error: errors.array() });
        return null;
      }
      const {
        name, category, farmer_id, availability, available, stock, price,
      } = req.body;
      res.setHeader('Content-Type', 'application/json');
      db.query('INSERT INTO products (name, category, farmer_id, available, availability, stock, price) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [name, category, farmer_id, available, availability, stock, price],
        (err, result) => {
          if (err)
          {
            res.status(500).send({ error: 'An error occured while adding new products' });
            return null;
          }
          res.sendStatus(204);
          return null;
        });
      return null;
    }
    catch (err)
    {
      debug(err);
      console.log(err);
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
