var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var User = require('./User.js');

var Admin = sequelize.define('Admin', {
  cid: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: User,
      key: 'cid'
    }
  }
},
{
  timestamps: false
});

module.exports = Admin;
