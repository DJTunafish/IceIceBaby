var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");


var authenticatedToken = 0;


/*
  To run these tests, the user with cid 'test' and all its relations must have been removed.
*/

/*
  NOTE: When writing new tests, and the test involves sending a proper token, use authorizedToken.
  When receiving a reply, execute statement: authenticatedToken = res.body.token;
*/

/*
  Simply requesting the server should not work.
*/
describe("test simple request", function() {
  it("should return a 200 status code", function(done) {
    server.
      get("/").
      expect("Content-type",/json/).
      expect(404).
      end(function(err, res) {
        res.status.should.equal(404);
        done();
    });
  });

/*
  A test checking that a register is successful.
*/
  it("should be a good register with cid test", function(done) {
    server.
      post("/register").
      send({
        cid: "test",
        firstname: "test",
        lastname: "test",
        personnumber: "9",
        password: "test",
        email: "test"
      }).
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.equal("success");
        done();
      });
  });

/*
  A test cheking that the same registration should not be allowed twice. This one was ran in the above test already.
*/
  it("should be a bad register with cid test, which is now a duplicate", function(done) {
    server.
      post("/register").
      send({
        cid: "test",
        firstname: "test",
        lastname: "test",
        personnumber: "9",
        password: "test",
        email: "test"
      }).
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.equal("fail");
        done();
      });
  });

/*
  Give the proper login information and the test should succeed, and the user be logged in.
  This is reported back by the result = success and the cid = "test" checks.
*/
  it("should return 200 with a good login", function(done) {
    server.
      post("/login").
      send({
        cid: "test",
        password: "test"
      }).
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.equal("success");
        res.body.cid.should.equal("test");
        authenticatedToken = res.body.token;
        done();
      });
  });

/*
  If the password is bad, this test should fail, and the user should not be authenticated.
*/
  it("should return failed login with a bad pass", function(done) {
    server.
      post("/login").
      send({
        cid: "test",
        password: "badtest"
      }).
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.not.equal("success");
        done();
      });
  });

/*
  If the id is bad, this test shopuld fail, and the user should not be authenticated. Mainly because there wont be a user to authenticate.
*/
  it("should return failed login with a bad cid", function(done) {
    server.
      post("/login").
      send({
        cid: "badtest",
        password: "test"
      }).
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.not.equal("success");
        done();
      });
  });

/*
  If the user does not provide a token, this test should not return a users profile.
*/
  it("Non-authenticated user can not request a profile", function(done) {
    server.
      get("/student").
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.equal("failure, user not authenticated");
        done();
    });
  });

/*
  If the user provides and authenticated token, he or she should receive his or hers profile, and the test should pass.
*/
  it("Authenticated user should be able to request a profile", function(done) {
    server.
      get("/student?cid=test").
      set("Authorization", authenticatedToken).
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.equal("success");
        res.body.student.should.not.equal("undefined");
        authenticatedToken = res.body.token;
        done();
    });
  });

/*
  This test tests if given proper cid and course, can a student register to a course? A student should NOT be able to do so.
*/
  it("Non-authenticated user should not be able to join a course", function(done) {
    server.
      post("/student/join/course").
      send({cid: "test", gencode: "abcde"}). /* valid student and course, but no token */
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.equal("failure, user not authenticated");
        done();
    });
  });

/*
  If a user provides a proper cid, course and a authorized, valid token, he or she should be allowed to register to a course.
*/
  it("Authenticated user should be able to join a course", function(done) {
    server.
      post("/student/join/course").
      send({cid: "test", gencode: "abcde"}). /* valid student and course, but no token */
      set("Authorization", authenticatedToken).
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.equal("success");
        authenticatedToken = res.body.token;
        done();
    });
  });
});
