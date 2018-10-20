const fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  basename = path.basename(__filename),
  config = require('../config'),
  dbConfig = require('../config/db')[config.environment],
  db = {};

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
//   })
//   .forEach(file => {
//     const model = sequelize.import(path.join(__dirname, file));
//     db[model.name] = model;
//   });

fs.readdirSync(__dirname)
  .filter(file => {
    return fs.lstatSync(`${__dirname}/${file}`).isDirectory();
  })
  .forEach(file => {
    // aca tengo todas las carpetas con models, ahora tengo que por cada una, traerme todas las que esten bajo schemas
    // estoy en customer -> dame todas los archivos dentro de __dirname/file/schemas y despues xq cada js hacer el import
    fs.readdirSync(path.join(__dirname, file, 'schemas')).forEach(schema => {
      const model = sequelize.import(path.join(__dirname, file, 'schemas', schema));
      db[model.name] = model;
    });
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;