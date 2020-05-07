const express = require('express');
const { check } = require('express-validator');
const passport = require('passport');
const users = require('../controllers/users.js');
const router = express.Router();

/* GET users listing. */
router.post('/register', [
  check('firstName').isString().isLength({ min: 3 }).trim()
    .escape(),
  check('firstName').isString().isLength({ min: 3 }).trim()
    .escape(),
  check('email').isEmail().normalizeEmail(),
  check('phone').isLength({ min: 11, max: 11 }).trim().escape(),
  check('password').isAscii().isLength({ min: 8, max: 16 }).trim()
    .escape(),
  check('city').isString().isAscii().trim()
    .escape(),
  check('userType').isNumeric().isIn([0, 1, 2]),
  check('state').isString().isAscii().trim()
    .escape(),
  check('country').isString().isAscii().trim()
    .escape(),
  check('address').isString().isAscii().trim()
    .escape(),
], users.register);

router.post('/login', [
  check('email').isEmail().normalizeEmail(),
  check('password').isAscii().isLength({ min: 8, max: 16 }).trim()
    .escape(),
], users.login);

module.exports = router;
