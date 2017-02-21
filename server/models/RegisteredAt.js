var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');
var Student = require('./Student.js');
var Course = require('./Course.js');
var RegisteredAt = sequelize.define('RegisteredAt', {
  student: {
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
  },
  score: {
    type: Sequelize.INTEGER
  }
  //Composite keys unsupported in sequelize
  //PRIMARY KEY (student, course)
},
{
  timestamps: false,
  freezeTableName: true
});

module.exports = RegisteredAt;
