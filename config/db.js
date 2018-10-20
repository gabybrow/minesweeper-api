const config = require('../config').common.database;

module.exports = {
  development: {
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    dialect: 'postgres',
    logging: true
  },
  testing: {
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    dialect: 'postgres',
    logging: false
  }
};
