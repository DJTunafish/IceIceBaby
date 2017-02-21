var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');
var Student = require('./Student.js');
var Course = require('./Course.js');
var RegisteredAt = sequelize.define('RegisteredAt', {
  student: {
    references: {
      model: Student,
      key: 'cid'
    }
  }
  course: {
    references: {
      model: Course,
      key: 'gencode'
    }
  }
  score: {
    type: SMALLINT
  }
  //Composite keys unsupported in sequelize
  //PRIMARY KEY (student, course)
}

module.exports = RegisteredAt;
