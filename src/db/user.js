/**
 *
 * @see https://github.com/passport/express-3.x-http-basic-example
 */

const USERS = require('../../user-db');

/*
module.exports = [
const USERS = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
]; */

exports.findByUsername = (username, done) => {
  process.nextTick(() => {
    const SIZE = USERS.length;

    for (let idx = 0; idx < SIZE; idx++) {
      var record = USERS[idx];

      if (record.username === username) {
        return done(null, record);
      }
    }

    return done(null, null);
  });
};
