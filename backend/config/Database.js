const { Sequelize } = require('sequelize');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
// console.log(dbConfig.dialect);
// const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
//     host: dbConfig.host,
//     dialect: dbConfig.dialect,
// });
const sequelize = new Sequelize(`${dbConfig.dialect}://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
// Export the configured Sequelize instance
module.exports = sequelize;
