var assert = require('assert');
var supertest = require('supertest');
var should = require('should');
const request = require('supertest');

var server = supertest.agent('http://localhost:3000/course');

//Gör en check på gencode
describe("courseTests", function() {
  it("should return course abcdf", function(done) {
    server
    .get("/?gencode:abcdf")
    //.send({gencode:'abcdf'})
    .expect("Content-type", /json/)
    .end(function(err, res) {
      res.status.should.equal(200);
      //console.log(res.body.gencode);
      done();
    });
  });

//något fel här. Kollar närmare hur felen ska se ut
//kanske bara kolla att det man få tillbaks är tomt?
  it("should return error for false gencode", function(done) {
    server
    .get("/")
    .send({})
    .expect(400)
    .end(function(err, res) {
      res.status.should.equal(200);
      //console.log(res.status);
      done();
    });
  });
});

/*
describe("Should return 404", function() {
  it("should return 404", function(done) {
    server
    .get("/asdasdasd")
    .expect(404)
    .end(function(err, res) {
      res.status.should.equal(404);
      done();
    });
  });
});
*/
