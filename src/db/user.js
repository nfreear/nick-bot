/**
 * A User "database" model.
 *
 * @author Nick Freear, 22-Jul-2020.
 *
 * @see https://github.com/passport/express-3.x-http-basic-example
 */

const JS_DATA_PATH = '../../user-db';

/* module.exports = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
]; */

exports.connect = (logger = null) => {
  try {
    const USERS = require(JS_DATA_PATH);

    logger && logger.info(`User-db loaded OK. Records: ${USERS.length}`);
  } catch (error) {
    if (logger) {
      logger.error(`ERROR loading user-db: ${error}`);
    } else {
      console.error('ERROR loading user-db:', error);
    }
    process.exit(1); // Fatal!
  }
};

exports.findByUsername = (username, done) => {
  const USERS = require(JS_DATA_PATH);

  process.nextTick(() => {
    const record = USERS.find(row => row.username === username);

    if (record) {
      // Patch in a 'verify' function.
      record.verifyPassword = (password) => record.password === password;

      return done(null, record);
    }
    return done(null, null);
  });
};
