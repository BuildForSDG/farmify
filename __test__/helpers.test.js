const helpers = require('../lib/helpers');
const request = require('express').request;
const response = require('express').response;



process.env.SECRET = 'aBigSecret';
describe('Helper Functions', function(){
    it('hash(): should encrypt a string', function(){
        let str = 'myPassword';
        hashedStr = helpers.hash(str);
        expect(hashedStr).not.toMatch(new RegExp(str));
        expect(hashedStr.length).toBeGreaterThan(str.length);
    })

    // it('generateToken(): should return a response object and have a cookie header', function(){
    //     let res = helpers.generateToken(request, 2, 'David');
    //     expect(res.get('Set Cookie')).toBeDefined();
    // })

    it('cookieExtractor(): should extract cookies if they exist from a request or return null', function(){
        expect(helpers.cookieExtractor(response)).toBeNull();
    })

    it('request(): should craft a request and sends it to a server', function(done){
        helpers.request('http://google.com/search?q=hello+world','GET',{},null,function(err, res, resBody){
            if(err){
                return done()
            }
            expect([200,302,301]).toContain(res.statusCode);
            expect(resBody.length).toBeGreaterThan(200);
            done();
        })
    })
})
