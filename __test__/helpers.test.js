const { response } = require('express');
const helpers = require('../lib/helpers');


process.env.SECRET = 'aBigSecret';
describe('Helper Functions', () => {
  it('hash(): should encrypt a string', () => {
    const str = 'myPassword';
    hashedStr = helpers.hash(str);
    expect(hashedStr).not.toMatch(new RegExp(str));
    expect(hashedStr.length).toBeGreaterThan(str.length);
  });

  // it('generateToken(): should return a response object and have a cookie header', function(){
  //     let res = helpers.generateToken(request, 2, 'David');
  //     expect(res.get('Set Cookie')).toBeDefined();
  // })

  it('cookieExtractor(): should extract cookies if they exist from a request or return null', () => {
    expect(helpers.cookieExtractor(response)).toBeNull();
  });

  it('request(): should craft a request and sends it to a server', (done) => {
    helpers.request('http://google.com/search?q=hello+world', 'GET', {}, null, (err, res, resBody) => {
      if (err) {
        return done();
      }
      expect([200, 302, 301]).toContain(res.statusCode);
      expect(resBody.length).toBeGreaterThan(200);
      return done();
    });
  });
});

