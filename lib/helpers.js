const crypto = require('crypto');
const http = require('http');
const { parse } = require('url');
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
  request(url, method, headers, body, callback)
  {
    const bodyString = JSON.stringify(body);
    const req = http.request(url, {
      method,
      headers,
    }, (res) => {
      let resBody = '';
      res.on('data', (chunk) => {
        resBody += chunk;
      });
      res.on('end', () => {
        callback(null, res, resBody);
      });
    });
    req.on('error', (e) => {
      callback(e);
    });
    req.write(bodyString);
    req.end();
  },

};
