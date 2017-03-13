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
      res.body.result.should.equal("success");
      res.body.questions.length.should.not.equal(0);
      done();
    });
  });

  it("Given invalid gencode doesnt return any questions", function(done) {
    server
    .get("/questions?gencode=11111")
    .expect("Content-type", /json/)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.questions.length.should.equal(0);
      done();
    });
  });

  it('Correctly post score for a user', function(done) {
   var random = Math.floor(Math.random() * 100) + 1 ;
   server
     .post("/score")
     .send({cid: "krookr", gencode: "abcde", score:random})
     .expect("Content-type", /json/)
     .expect(200)
     .end(function(err, res) {
       res.status.should.equal(200);
       res.body.result.should.equal("success");
       done();
   });
 });

  it('Return Error when trying to post score over 100', function(done) {
    server
      .post("/score")
      .send({cid: "krookr", gencode: "abcde", score:110})
      .expect("Content-type", /json/)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.equal("failure: score not within proper boundaries");
        done();
    });
  });

  it('Return Error when trying to post score under 100', function(done) {
   server
     .post("/score")
     .send({cid: "krookr", gencode: "abcde", score:-10})
     .expect("Content-type", /json/)
     .expect(200)
     .end(function(err, res) {
       res.status.should.equal(200);
       res.body.result.should.equal("failure: score not within proper boundaries");
       done();
   });
  });

});
