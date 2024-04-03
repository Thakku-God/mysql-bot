// database.js

const mariadb = require('mariadb');
const { clientId, guildId, token, db_host, db_user, db_password, db_database } = require('./config.json');

const pool = mariadb.createPool({
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_database,
    connectionLimit: 5, // Adjust the connection limit as needed
    charset: 'utf8mb4',
});

module.exports = {
    pool,
};
