var assert = require('assert');
var supertest = require('supertest');
var should = require('should');
const request = require('supertest');

var server = supertest.agent('http://localhost:3000/group');

/*
describe("Group test", function() {
  it("Gets the questions for a course", function(done) {
    server
    .get("/questions?gencode=abcde")
    .expect("Content-type", /json/)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body[0].question.should.equal('How tall is Robert?');
      done();
    });
  });

});

*/
