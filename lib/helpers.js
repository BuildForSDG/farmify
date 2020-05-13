const crypto = require('crypto');
const http = require('http');
const jwt = require('jsonwebtoken');


module.exports = {
  hash(string)
  {
    try
    {
      const hashedString = crypto.createHmac('sha256', process.env.SECRET).update(string).digest('hex');
      return hashedString;
    }
    catch (err)
    {
      return null;
    }
  },
  request(url, method, headers, body, callback)
  {
    const bodyString = JSON.stringify(body || {});
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
  generateToken(res, id, firstName) {
    const expiration = process.env.NODE_ENV === 'development' ? '1h' : '7d';
    const cookieExpiration = process.env.NODE_ENV === 'development' ? 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const token = jwt.sign({ id, firstName }, process.env.SECRET, { expiresIn: expiration });
    return res.cookie('token', token, {
      expires: new Date(Date.now() + cookieExpiration),
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
    });
  },
  cookieExtractor(req) {
    let token = null;
    if (req && req.cookies)
    {
      token = req.cookies.token;
    }
    return token;
  },
};
