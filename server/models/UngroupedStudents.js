var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var Student = require('./Student.js');
var Course = require('./Course.js');

/*
  This model actually models a view, but there is no way in sequelize right now to
  define a model as an actual view. As far as sequelize is aware, this is just another table.
*/
var UngroupedStudents = sequelize.define('ungroupedStudents', {
  cid: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Student,
      key: 'cid'
    }
  },
  course: {
    type: Sequelize.STRING,
    references: {
      model: Course,
      key: 'gencode'
    }
  }
},
{
  timestamps: false,
  freezeTableName: true
});

module.exports = UngroupedStudents;
