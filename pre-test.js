/* eslint-disable no-shadow */
const db = require('./db');

db.query(`CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY NOT NULL, 
    firstName varchar(255) NOT NULL, 
    lastName varchar(255) NOT NULL, 
    phone varchar(255) NOT NULL, 
    email varchar(255) NOT NULL UNIQUE, 
    password varchar(255) NOT NULL, 
    address varchar(255) NOT NULL, 
    city varchar(20) NOT NULL, 
    state varchar(20) NOT NULL, 
    country varchar(20) NOT NULL, 
    userType integer NOT NULL)`, [], (err, res) => {
  if (err)
  {
    return err;
  }
  return db.query('DELETE FROM users', [], (err, _res) => {
    if (err) return err;
    console.log('pretest done');
    db.end();
    return _res;
  });
});
