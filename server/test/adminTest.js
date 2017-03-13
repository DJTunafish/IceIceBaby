
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


    it("tries to remove non-existing course", function(done) {
        server
            .post("/removecourse")
            .send({gencode: 'noCourseLikeThis'})
            .expect("Content-type",/json/)
            .expect(500)
            .end(function(err, res) {
             res.status.should.equal(500);
             done();
            });
    });


    it("Non-authenticated admin should not be able to request courses", function(done) {
        server.
        get("/courses?cid=notAdmin").
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
            res.status.should.equal(500);
            should.not.exist(res.body.courses);
            done();
        });
    });

});
