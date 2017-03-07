var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var Student = require('./Student.js');
var Course = require('./Course.js');

/*
  This model actually models a view, but there is no way in sequelize right now to
  define a model as an actual view. As far as sequelize is aware, this is just another table.
*/
var GroupMembers = sequelize.define('GroupMembers', {
  cid: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Student,
      key: 'cid'
    }
  },
  firstname: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  profile: {
    type: Sequelize.STRING
  },
  id: {
    type: Sequelize.STRING
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

module.exports = GroupMembers;
