var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var Student = require('./Student.js');
var Course = require('./Course.js');

var Group = sequelize.define('Group', {
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
  },
  score: {
    type: Sequelize.INTEGER
  }
});

module.exports = Group;
