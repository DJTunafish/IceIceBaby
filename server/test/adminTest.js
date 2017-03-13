
var assert = require('assert');
var supertest = require('supertest');
var should = require('should');
const request = require('supertest');

var server = supertest.agent('http://localhost:3000/admin');

describe("admin test", function() {

  it("get the admin give cid", function(done) {
    server
    .get("?cid=adamin")
    .expect("Content-type", /json/)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.cid.should.equal('adamin');
      done();
    });
  });

  it("returns nothing given cid who isnt admin", function(done) {
    server
    .get("?cid=adaasdasdmin")
    .expect("Content-type", /json/)
    .end(function(err, res) {
      res.status.should.equal(200);
      should.equal(res.body, null);
      done();
    });
  });

  it("return 404 on wrong path", function(done) {
    server
    .get("/asdasdasd")
    .expect(404)
    .end(function(err, res) {
      res.status.should.equal(404);
      done();
    });
  });

});
