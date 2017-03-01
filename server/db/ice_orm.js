'use strict';

var Sequelize = require('sequelize');


// Sequelize('astern', 'astern', 'srJiMob7', {
//can only be accessed within chalmers network
var sq = new Sequelize('iceicebaby', 'test', 'test', {
    host: 'localhost',
    dialect: 'mysql', //|'sqlite'|'postgres'|'mssql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }

    // SQLite only
    //storage: 'path/to/database.sqlite'
});

module.exports = sq;
