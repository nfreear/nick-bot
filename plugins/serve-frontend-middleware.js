/**
 * Serve static frontend files in './public' (HTML, CSS, JS, )
 *
 * @author Nick Freear, 22-Jul-2020.
 */

const { PluginBase, defaultContainer } = require('../src/plugin-base');
const ChatAuthentication = require('../src/chat-authentication');
const express = require('express');
const { join } = require('path');

const PUBLIC_PATH = join(__dirname, '..', 'public');

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
    const server = this.container.get('api-server').app;

    this.logger.info(`${this.name}.start()`, server);

    if (!server) {
      throw new Error('No api-server found');
    }

    this.app = server;

    const AUTH = new ChatAuthentication(server, this.logger);

    AUTH.setup();

    this.app.use(express.static(PUBLIC_PATH));

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
