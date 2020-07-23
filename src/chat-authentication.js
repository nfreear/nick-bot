/**
 * Passport & HTTP-Basic authentication for the front and backend!
 *
 * @author Nick Freear, 22-Jul-2020.
 */

// const { defaultContainer, Clonable } = require('@nlpjs/core');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const DB = require('./db');

class ChatAuthentication /* extends Clonable */ {
  /* constructor (settings = {}, container = null) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.name = 'BotAuthentication';
  } */

  constructor (expressApp, logger) {
    this.app = expressApp;
    this.logger = logger;
  }

  setup () {
    this.setupPassport();

    this.loginRoute();
    this.logoutRoute();
    this.userJsonRoute();
    // this.chatBotDirectlineRoute();
    this.indexHtmlRoute();
  }

  setupPassport () {
    const logger = this.logger;

    passport.use(new BasicStrategy(
      (username, password, done) => {
        DB.user.findByUsername(username, (err, user) => {
          if (err) {
            logger.error(`Auth error: ${username} ~ ${err}`);
            return done(err);
          }
          if (!user) {
            logger.error(`Auth: username not found: ${username}`);
            return done(null, false);
          }
          if (user.password !== password) {
            logger.error(`Auth: incorrect password: ${username}`);
            return done(null, false);
          }
          // Otherwise, success!
          logger.info(`Auth: logged in OK: ${user.username}`);
          return done(null, user);
        });
      })
    );

    logger.info('Passport setup OK.');
  }

  loginRoute () {
    this.app.get('/login',
      passport.authenticate('basic', { session: false }),
      (req, res) => {
        this.logger.info(`Auth: login ~ User: ${req.user.username}`);
        res.redirect('/?logged-in');
      }
    );
  }

  logoutRoute () {
    this.app.get('/api/logout', (req, res) => {
      this.logger.info('Auth: logout');
      req.logout();
      res.status(401).json({ code: 401, message: 'Unauthorized' });
    });
  }

  indexHtmlRoute () {
    this.app.get('/',
      passport.authenticate('basic', { session: false }),
      (req, res, next) => {
        this.logger.info(`Auth: index.html ~ User: ${req.user.username}`);
        next();
      }
    );
  }

  userJsonRoute () {
    this.app.get('/api/user/:userId',
      passport.authenticate('basic', { session: false }),
      (req, res) => {
        const USER = req.user;
        USER.password = null;

        this.logger.info(`Auth: get user: ${USER.username}`);

        res.json(USER);
      }
    );
  }

  chatBotDirectlineRoute () {
    // http://localhost:3000/directline/conversations/5feb4c99-a87b-51f1-3b1b-32e94f5814e0/activities?watermark=
    this.app.get('/directline/conversations/:convId/activities',
      passport.authenticate('basic', { session: false }),
      (req, res, next) => {
        // this.logger.info(`Auth: directline: ${req.user.username}`);

        next();
      }
    );
  }
}

module.exports = ChatAuthentication;
