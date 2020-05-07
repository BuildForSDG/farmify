const { spawn } = require('child_process');
const { request } = require('../lib/helpers');


const childProcess = spawn('node', ['./bin/www'], { env: { NODE_ENV: 'test' } });
// beforeAll(() => {
//   child_process=
// })
afterAll(() => {
  childProcess.kill('SIGTERM');
});
describe('User registration endpoint', () => {
  it('should create a new user', async (done) => {
    const body = {
      firstName: 'David',
      lastName: 'Salam',
      email: 'wizdave97@gmail.com',
      phone: '08163458664',
      password: 'valerianSpace2@',
      city: 'Uyo',
      state: 'Akwa Ibom',
      address: 'Abak Road',
      country: 'NIgeria',
      userType: 1,
    };
    request('http://localhost:3000/users/register', 'POST', {
      'Content-Type': 'application/json',
    }, body, (err, res, resBody) => {
      if (err)
      {
        // console.log(err)
        throw new Error(err);
      }
      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(resBody).success).toBeDefined();
      done();
    });
  });
  it('should return an error code of 422', async (done) => {
    const body = {
      firstName: 'David',
      lastName: 'Salam',
      email: 'wizdave97@gmail.com',
      phone: '08163458664',
      password: 'valerianSpace2@',
    };
    request('http://localhost:3000/users/register', 'POST', {
      'Content-Type': 'application/json',
    }, body, (err, res, resBody) => {
      if (err)
      {
        // console.log(err)
        throw new Error(err);
      }
      expect(res.statusCode).toEqual(422);
      expect(JSON.parse(resBody).error).toBeDefined();
      done();
    });
  });
});
describe('User Login Endpoint', () => {
  it('should login the user successfully', (done) => {
    const body = {
      email: 'wizdave97@gmail.com',
      password: 'valerianSpace2@',
    };
    request('http://localhost:3000/users/login', 'POST', {
      'Content-Type': 'application/json',
    }, body, (err, res, resBody) => {
      if (err)
      {
        // console.log(err)
        throw new Error(err);
      }
      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(resBody).user).toBeDefined();
      done();
    });
  });
  it('should not login unauthorized user', (done) => {
    const body = {
      email: 'example@gmail.com',
      password: 'valerianSpace2@',
    };
    request('http://localhost:3000/users/login', 'POST', {
      'Content-Type': 'application/json',
    }, body, (err, res, resBody) => {
      if (err)
      {
        // console.log(err)
        throw new Error(err);
      }
      expect(res.statusCode).toEqual(401);
      expect(JSON.parse(resBody).user).toBeUndefined();
      done();
    });
  });
});
