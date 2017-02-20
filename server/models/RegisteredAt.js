var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

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
