const express = require('express');
const { check } = require('express-validator');
const passport = require('passport');
const users = require('../controllers/users.js');

const router = express.Router();

/* GET users listing. */
router.post('/register', [
  check('firstname', 'firstname must be a string with a minimum of 3 characters').isString().isLength({ min: 3 }).trim()
    .escape(),
  check('lastname', 'lastname must be a string with a minimum of 3 characters').isString().isLength({ min: 3 }).trim()
    .escape(),
  check('email', 'A valid email is required').isEmail().normalizeEmail(),
  check('phone', 'A valid phone number of 11 digits is required').isLength({ min: 11, max: 11 }).trim().escape(),
  check('password', 'A password of at least 8 characters and max 16 cahracters required').isAscii().isLength({ min: 8, max: 16 }).trim()
    .escape(),
  check('city', 'city must be a string').isString().isAscii().trim()
    .escape(),
  check('usertype', 'user type must be a number with value either 0, 1, or 2').isNumeric().isIn([0, 1, 2]),
  check('state', 'state must be a string and is required').isString().isAscii().trim()
    .escape(),
  check('country', 'country must be a string and is required').isString().isAscii().trim()
    .escape(),
  check('address', 'address must be a string and is required').isString().isAscii().trim()
    .escape(),
], users.register);
router.patch('/user', [
  check('firstname', 'firstname must be a string with a minimum of 3 characters').isString().isLength({ min: 3 }).trim()
    .escape(),
  check('lastname', 'lastname must be a string with a minimum of 3 characters').isString().isLength({ min: 3 }).trim()
    .escape(),
  check('email', 'A valid email is required').isEmail().normalizeEmail(),
  check('phone', 'A valid phone number of 11 digits is required').isLength({ min: 11, max: 11 }).trim().escape(),
  check('city', 'city must be a string').isString().isAscii().trim()
    .escape(),
  check('usertype', 'user type must be a number with value either 0, 1, or 2').isNumeric().isIn([0, 1, 2]),
  check('state', 'state must be a string and is required').isString().isAscii().trim()
    .escape(),
  check('country', 'country must be a string and is required').isString().isAscii().trim()
    .escape(),
  check('address', 'address must be a string and is required').isString().isAscii().trim()
    .escape(),
], users.updateUser);
router.post('/login', [
  check('email', 'valid email required').isEmail().normalizeEmail(),
  check('password', 'valid password required').isAscii().isLength({ min: 8, max: 16 }).trim()
    .escape(),
], users.login);

router.post('/farmer', [
  check('farm_name', 'farm_name is required').isLength({ min: 3, max: 16 }).trim().escape(),
  check('farm_capacity', 'farm_capacity is required must be a number').isNumeric(),
  check('product_names', 'product names is required, must be an array of strings').isArray({ min: 1 }),
], users.addFarmer);

router.patch('/farmer', [
  check('farm_name', 'farm_name is required').isLength({ min: 3, max: 16 }).trim().escape(),
  check('farm_capacity', 'farm_capacity is required must be a number').isNumeric(),
  check('product_names', 'product names is required, must be an array of strings').isArray({ min: 1 }),
], users.updateFarmer);
module.exports = router;
