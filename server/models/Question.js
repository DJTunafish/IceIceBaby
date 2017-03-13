var Sequelize = require('sequelize');
var sequelize = require('../db/ice_orm.js');

var Course = require('./Course.js');

var Question = sequelize.define('Question', {
  question: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  answer: {
    type: Sequelize.STRING,
  },
  weight: {
    type: Sequelize.FLOAT
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

module.exports = Question;
