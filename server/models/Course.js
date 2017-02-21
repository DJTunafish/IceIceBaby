var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var Admin = require('./Admin.js');

var Course = sequelize.define('Course', {

  //code one regs with
  gencode: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  coursecode: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
  },
  admin: {
    type: Sequelize.STRING,
    references: {
      model: Admin,
      key: 'cid'
    }
  }
},
{
  timestamps: false,
  freezeTableName: true
});

module.exports = Course;
