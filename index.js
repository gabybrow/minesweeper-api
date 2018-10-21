const express = require('express'),
  migrationsManager = require('./migrations'),
  helmet = require('helmet'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  config = require('./config'),
  routes = require('./routes'),
  logger = require('./services/logger'),
  initialize = require('./config/init')(),
  cors = require('cors'),
  errors = require('./model/errors')
  swaggerJSDoc = require('swagger-jsdoc'),
  swaggerUi = require('swagger-ui-express');

const init = () => {
  const app = express();
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const swaggerDefinition = {
    info: {
      title: 'Minesweeper API',
      version: '1.0.0',
      description: 'Minesweeper API',
    },
    host: process.env.HOST || 'localhost:8080',
    basePath: '/',
  };
  
  // options for the swagger docs
  const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./model/*/router.js'],
  };
  
  // initialize swagger-jsdoc
  const swaggerSpec = swaggerJSDoc(options);

  if (!config.isTesting) {
    morgan.token('req-params', req => req.params);
    app.use(
      morgan(
        '[:date[clf]] :remote-addr - Request ":method :url" with params: :req-params. Response status: :status.'
      )
    );
  }

  app.use(cors());
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api', routes);
  app.use(errors.handle);

  module.exports = app;

  Promise.resolve()
    .then(() => {
      if (!config.isTesting) {
        return migrationsManager.check();
      }
    })
    .then(() => {
      app.listen(config.server.port, () => {
        logger.info(`Listening on port: ${config.server.port}`);
      });
    })
    .catch(logger.error);
};

init();
