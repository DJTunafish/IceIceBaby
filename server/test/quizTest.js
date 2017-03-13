var assert = require('assert');
var supertest = require('supertest');
var should = require('should');
const request = require('supertest');

var server = supertest.agent('http://localhost:3000/quiz');


describe("Quiz test", function() {
  it("Gets the questions for a course", function(done) {
    server
    .get("/questions?gencode=abcde")
    .expect("Content-type", /json/)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body[0].question.should.equal('How good would you say you are at defining BNF grammar on a scale from 1 to 10?');
      done();
    });
  });

  it("Given invalid gencode doesnt return any questions", function(done) {
    server
    .get("/questions?gencode=11111")
    .expect("Content-type", /json/)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.length.should.equal(0);
      done();
    });
  });

});
