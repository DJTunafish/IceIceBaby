
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

  //Går bara att köra en gång för att det postar faktiskt till databasen.
  it("Create a course as admin", function(done) {
    server
    .post("/createcourse")
    .send({gencode: 'qwe',
       coursecode: 'DAT123',
       name:'prog av databaser',
       description: 'en kurs där man lär sig',
        admin:'adamin'})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      console.log(res.body);
      res.body.gencode.should.equal('qwe');
      done();
    });
  });

  it("Not able to reg a course with a gencode already in use", function(done) {
    server
    .post("/createcourse")
    .send({gencode: 'abcdf',
      coursecode: 'DAT123',
      name:'prog av databaser',
       description: 'en kurs där man lär sig',
       admin:'adamin'})
    .expect("Content-type",/json/)
    .expect(500)
    .end(function(err, res) {
      res.status.should.equal(500);
      //console.log(err);
      done();
    });
  });

  it("removes Course given gencode", function(done) {
    server
    .post("/removecourse")
    .send({gencode: 'qwe'})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.text.should.equal('removed properly');
      done();
    });
  });


});
