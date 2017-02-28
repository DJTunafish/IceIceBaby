var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var User = sequelize.define('User', {
  cid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  personnumber: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  firstname: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
},
{
  timestamps: false,
  freezeTableName: true
});

module.exports = User;
