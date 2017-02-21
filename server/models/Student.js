var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var User = require('./User.js');

var Student = sequelize.define('Student', {
  cid: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: User,
      key: 'cid'
    }
  },
  profile: {
    type: Sequelize.STRING
  }
},
{
  timestamps: false,
  freezeTableName: true
});

module.exports = Student;
