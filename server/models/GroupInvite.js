var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var Student = require('./Student.js');
var Course = require('./Course.js');

var groupInvite = sequelize.define('GroupInvite', {
  sender: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Student,
      key  : 'cid'
    }
  },
  receiver: {
    type: Sequelize.STRING,
    references: {
      model: Student,
      key  : 'cid'
    }
  },
  course: {
    type: Sequelize.STRING,
    references: {
      model: Course,
      key  : 'gencode'
    }
  }
},
{
  timestamps: false,
  freezeTableName: true
});

module.exports = groupInvite;
