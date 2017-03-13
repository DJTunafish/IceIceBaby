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
        should.not.exist(res.body.cid);
        should.not.exist(res.body.token);
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
        should.not.exist(res.body.cid);
        should.not.exist(res.body.token);
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
        should.not.exist(res.body.student);
        should.not.exist(res.body.token);
        res.body.result.should.equal("failure, user not authenticated");
        done();
    });
  });

  /*
    If the user provides a bad token, this test should not return a users profile.
  */
    it("Non-authenticated user can not request a profile", function(done) {
      server.
        get("/student").
        set("Authorization", "thisisaverybadandcorrupttoken").
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          should.not.exist(res.body.student);
          should.not.exist(res.body.token);
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

  /*
    If a user provides a proper cid, course and a token, but a non-valid token,
    he or she should not be allowed to register to a course.
  */
    it("User with a bad authentication token should not be able to join a course", function(done) {
      server.
        post("/student/join/course").
        send({cid: "test", gencode: "abcde"}). /* valid student and course, but no token */
        set("Authorization", "thisisaverybadandcorrupttoken").
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          res.body.result.should.equal("failure, user not authenticated");
          done();
      });
    });

/*
  If a user is not authenticated, he or she should not be able to request a course.
*/
  it("Non-authenticated user should not be able to request a course", function(done) {
    server.
      get("/course?gencode=abcde").
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        should.not.exist(res.body.course);
        res.body.result.should.equal("failure, user not authenticated");
        done();
    });
  });

  /*
    If a user is not authenticated but still sends a token, albeit corrupt, he or she should not be able to request a course.
  */
    it("Non-authenticated user with a BAD token should not be able to request a course", function(done) {
      server.
        get("/course?gencode=abcde").
        set("Authorization", "thisisaverybadandcorrupttoken").
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          should.not.exist(res.body.course);
          res.body.result.should.equal("failure, user not authenticated");
          done();
      });
    });


/*
  If a user is logged in, a request for a course is allowed as long as an authorized token is passed along with the request.
*/
  it("Authenticated user should be able to request a course", function(done) {
    server.
      get("/course?gencode=abcde").
      set("Authorization", authenticatedToken).
      expect("Content-type", /json/).
      expect(200).
      end(function(err, res) {
        res.status.should.equal(200);
        res.body.result.should.equal("success");
        res.body.course.should.not.equal("undefined");
        authenticatedToken = res.body.token;
        done();
    });
  });

  /*
    If a user is logged in, a request for a course is allowed as long as an authorized token is passed along with the request.
    If the course is not present, however, this should be reported back to the client through the course-object being empty.
  */
    it("Authenticated user should not be able to request a course that does not exist", function(done) {
      server.
        get("/course?gencode=thisisabadgencode").
        set("Authorization", authenticatedToken).
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          res.body.result.should.equal("success");
          should.not.exist(res.body.course);
          authenticatedToken = res.body.token;
          done();
      });
    });

    it("Authenticated user should to get all ungrouped students of a course", function(done) {
      server.
        get("/course/ungrouped?course=abcde").
        set("Authorization", authenticatedToken).
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          res.body.result.should.equal("success");
          res.body.ungroupedStudents.should.not.equal("undefined");
          authenticatedToken = res.body.token;
          done();
      });
    });

    it("Authenticated user should NOT get any ungrouped students with a invalid coursecode", function(done) {
      server.
        get("/course/ungrouped?course=absdfsdfsdfdscde").
        set("Authorization", authenticatedToken).
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          res.body.result.should.equal("success");
          res.body.ungroupedStudents.length.should.equal(0);
          authenticatedToken = res.body.token;
          done();
      });
    });

    it("Return no groupmembers with invalid id och course", function(done) {
      server.
        get("/course/group").
        send({id:'1asdas', course:'abasdasdasddascde'}).
        set("Authorization", authenticatedToken).
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          res.body.result.should.equal("success");
          res.body.groupmembers.length.should.equal(0);
          done();
      });
    });

    it("Gets all groupsmembers registered at a course given gencode", function(done) {
      server.
        get("/course/allgroups?course=abcde").
        set("Authorization", authenticatedToken).
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          res.body.length.should.not.equal(0);
          done();
      });
    });

    it("Returns no groupsmembers registered at a course given invalid gencode", function(done) {
      server.
        get("/course/allgroups?course=abasdasdcde").
        set("Authorization", authenticatedToken).
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          res.body.length.should.equal(0);
          done();
      });
    });

    it("Authenticated user should be able to join a course", function(done) {
      server.
        post("/course/register").
        send({cid: "test", gencode: "abcde"}).
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

    it("Authenticated user should NOT be able to join a course they have already joined", function(done) {
      server.
        post("/course/register").
        send({cid: "test", gencode: "abcde"}).
        set("Authorization", authenticatedToken).
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          res.body.result.should.equal("success");
          res.body.message.should.equal("Already registered to course");
          authenticatedToken = res.body.token;
          done();
      });
    });

    it("Authenticated user should NOT be able to join a course that doesnt exist", function(done) {
      server.
        post("/course/register").
        send({cid: "test", gencode: "abasdasdsacde"}).
        set("Authorization", authenticatedToken).
        expect("Content-type", /json/).
        expect(200).
        end(function(err, res) {
          res.status.should.equal(200);
          res.body.result.should.equal("success");
          res.body.message.should.equal("No such course exists");
          authenticatedToken = res.body.token;
          done();
      });
    });
});
