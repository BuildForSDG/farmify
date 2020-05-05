const crypto = require('crypto');
const { secret } = require('../config');

module.exports = {
  hash(string)
  {
    try
    {
      const hashedString = crypto.createHmac('sha256', secret).update(string).digest('hex');
      return hashedString;
    }
    catch (err)
    {
      return null;
    }
  },
};
