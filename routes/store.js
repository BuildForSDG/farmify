const express = require('express');
const { body, query } = require('express-validator');
const multer = require('multer');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const store = require('../controllers/store');

const storage = multer.diskStorage({
  destination: path.resolve(process.cwd(), 'public/images'),
  filename(req, file, cb) {
    try
    {
      if (file)
      {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${file.mimetype.match(/(?:\/|\\)\w+$/)[0].replace(/[\\/]/, '')}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}`.trim());
      }
      else cb(new multer.MulterError(400, 'No file uploaded'));
    }
    catch (err)
    {
      cb(new multer.MulterError(400, 'file upload error'));
    }
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    try
    {
      if (file)
      {
        const mimetype = file.mimetype.match(/(?:\/|\\)\w+$/)[0].replace(/[\\/]/, '');
        if (['png', 'jpeg', 'jpg'].indexOf(mimetype.trim()) <= -1)
        {
          cb('Only png or jpeg or jpg images are accepted', false);
          return null;
        }
        cb(null, true);
        return null;
      }
      cb(new multer.MulterError(400, 'No file uploaded'), false);
      return null;
    }
    catch (err)
    {
      cb(new multer.MulterError(400, 'file upload error'), false);
      return null;
    }
  },
  limits: {
    fileSize: 3 * 1000000,
  },
});

function checkFile(req, res, next) {
  if (req.file) next();
  else next(new multer.MulterError(400, 'product image was not uploaded, it is required'));
}
const router = express.Router();


router.get('/all', [
  query('category').isString().trim().escape(),
  query('city').isString().trim().escape(),
  query('state').isString().trim().escape(),
  query('price').isString().trim().escape(),
  query('page').isNumeric().trim().escape(),
], store.fetchAll);

router.post('/product', upload.single('product_image'), checkFile, [
  body('name', 'product name is required').isLength({ min: 3 }).trim().escape(),
  body('category', 'product category is required').isLength({ min: 3 }).trim().escape(),
  body('farmer_id', 'farmer_id is required').isNumeric(),
  body('available', 'product availability is required true or false').isBoolean(),
  body('availability', 'availability date is required').isString().trim().escape(),
  body('stock', 'available stock value is required').isNumeric(),
  body('price', 'price per unit is required').isNumeric(),
], store.postProduct);

router.get('/search', store.searchProduct);

module.exports = router;
