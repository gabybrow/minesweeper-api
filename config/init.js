'use strict';

/**
 * Module dependencies.
 */
const glob = require('glob');

// const loggerInit = require('./logger');

/**
 * Module init function.
 */
module.exports = () => {
  /**
   Before we begin, lets set the environment variable
   We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
  */

  const environmentFiles = glob.sync(`./config/env/${process.env.NODE_ENV}.js`);

  // let logger;
  if (!environmentFiles.length) {
    // logger = loggerInit('development');
    if (process.env.NODE_ENV) {
      // logger.error(
      //   `No configuration file found for "${process.env.NODE_ENV}" environment using development instead`
      // );
      console.error(
        `No configuration file found for "${process.env.NODE_ENV}" environment using development instead`
      );
    } else {
      // logger.warn('NODE_ENV is not defined! Using default local environment');
      console.log('NODE_ENV is not defined! Using default local environment');
    }
    process.env.NODE_ENV = 'development';
  } else {
    // logger = loggerInit(process.env.NODE_ENV);
    // logger.info(`Application loaded using the "${process.env.NODE_ENV}" environment configuration`);
    console.log(`Application loaded using the "${process.env.NODE_ENV}" environment configuration`);
  }
  /**
   * Logger will be accessible everywhere
   */
  // global.logger = logger;
};
