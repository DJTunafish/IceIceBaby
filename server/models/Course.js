var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var Course = sequelize.define('Courses', {

  //code one regs with
  gencode: {
    type: Sequelize.VARCHAR,
    primaryKey: true,
    allowNull: false
  },
  coursecode: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  name: {
    type: Sequelize.VARCHAR,
    allowNull: false
  },
  description: {
    type: Sequelize.VARCHAR
  },
  admin: {
    type: Sequelize.VARCHAR,
    references: {
      model: Admin,
      key: 'cid'
    }
  }
    admin VARCHAR(20) REFERENCES Admin(cid)

});

module.exports = Course;
