var assert = require('assert');
var supertest = require('supertest');
var should = require('should');
const request = require('supertest');
var server = supertest.agent('http://localhost:3000/student');

describe("Student test", function() {
  it("Given correct cid returns the group", function(done) {
    server
    .get("/groups?cid=krookr")
    .expect("Content-type", /json/)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.length.should.not.equal(0);
      done();
    });
  });

  it("Given incorrect cid returns nothing", function(done) {
    server
    .get("/groups?cid=kroasdasdasdasokr")
    .expect("Content-type", /json/)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.length.should.equal(0);
      done();
    });
  });



});
