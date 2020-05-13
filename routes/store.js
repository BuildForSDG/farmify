const express = require('express');
const { body, query } = require('express-validator');
const passport = require('passport');
const store = require('../controllers/store');

const router = express.Router();


router.get('/all', [
  query('filter').isString().trim().escape(),
  query('page').isNumeric().trim().escape(),
], store.fetchAll);

router.post('/product', [
  body('name', 'product name is required').isString().trim().escape(),
  body('category', 'product category is required').isString().trim().escape(),
  body('farmer_id', 'farmer_id is required').isNumeric(),
  body('available', 'product availability is required true or false').isBoolean(),
  body('availability', 'availability date is required').isString().trim().escape(),
  body('stock', 'available stock value is required').isNumeric(),
  body('price', 'price per unit is required').isNumeric(),
], passport.authenticate('jwt'), store.postProduct);

router.get('/search', store.searchProduct);

module.exports = router;
