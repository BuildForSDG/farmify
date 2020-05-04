const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('<h1>Coming Soon, still in development</h1>');
});

module.exports = router;
