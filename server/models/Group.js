var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var Student = require('./Student.js');
var Course = require('./Course.js');

var Group = sequelize.define('Group', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  student: {
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
  timestamps: false
});

module.exports = Group;
