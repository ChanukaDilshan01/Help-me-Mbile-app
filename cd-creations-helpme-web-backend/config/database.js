// config/database.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('helpme_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3307
});

// const sequelize = new Sequelize('helpmesl', 'admin', 'tXVXyfLCdR4DcjCOd3W8', {
//   host: '127.0.0.1',
//   dialect: 'mysql',
//   port: 3306
// });

module.exports = sequelize;

///root/.nvm/versions/node/v20.12.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin