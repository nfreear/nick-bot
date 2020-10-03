/**
 * Serve static frontend files in './public' (HTML, CSS, JS, )
 *
 * @author Nick Freear, 22-Jul-2020.
 */

const { PluginBase, defaultContainer } = require('../plugin-base');
const ChatAuthentication = require('../chat-authentication');
const express = require('express');
const { join } = require('path');
const fs = require('fs');

const PUBLIC_PATH = join(__dirname, '..', '..', 'public');
const DIFF_PATH = join(__dirname, '..', '..', '.data', 'git-diff--29-jul-2020.diff');

class ServeFrontendMiddleware extends PluginBase {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.name = 'serveFrontend';
  }

  run (input) {
    this.logger.info(`${this.name}.run() ~ NO-OP!`);

    return input;
  }

  start () {
    const { AUTH_ENABLE, DIFF_ENABLE } = process.env;

    const server = this.container.get('api-server').app;

    this.logger.info(`${this.name}.start()`, server);

    if (!server) {
      throw new Error('No api-server found');
    }

    this.app = server;

    if (AUTH_ENABLE) {
      const AUTH = new ChatAuthentication(server, this.logger);

      AUTH.setup();
    } else {
      this.logger.warn('Auth disabled!');
    }

    this.app.use(express.static(PUBLIC_PATH));

    if (DIFF_ENABLE) {
      this.app.get('/glitch.diff', async (req, res) => {
        try {
          const DIFF = await fs.promises.readFile(DIFF_PATH, 'utf8');
          res.header('Content-Type', 'text/plain; charset=utf-8');
          res.send(DIFF);
        } catch (err) {
          this.logger.error('Error in "/glitch.diff" route.');
          this.logger.error(err);
          res.status(500).send('Something broke!');
        }
      });
    }

    /* // @nlpjs/express-api-server
    if (this.settings.serveBot) {
      this.app.use(express.static(path.join(__dirname, './public')));
    } */

    // this.app.use(this.useMiddleware());
  }

  useMiddleware () { // Possibly re-implement me !!
    const SELF = this;

    SELF.logger.info(`${this.name}.use() called!`);

    return (err, req, res, next) => {
      if (err) throw new Error(err);

      // Middleware functionality goes here!

      const logger = SELF.container.get('logger');

      logger.info(this.name, '~ run ~ ', Date.now());

      // this.logger.info(req);
      // this.logger.info('Req:', req.url, req.headers[ 'x-ms-bot-agent' ]);

      // Important: always call 'next()' !
      next();
    };
  }
}

module.exports = ServeFrontendMiddleware;
