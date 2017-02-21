var supertest = require('supertest');
var should = require('should');

var server = supertest.agent('http://localhost:3000/course/quiz');

describe("initial get Questions test", function() {
    it("should return no questions", function(done) {
        server
            .get("/questions?gencode=badcode")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.error.should.equal(false);
                res.body.innerHTML.should.equal("[]"); /* Empty json list? */
                done();
        });
    });
});

describe("get questions good test", function() {
    it("should return a few questions", function(done) {
        server
            .get("/questions?gencode=abcde")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.error.should.equal(false);
                res.body.innerHTML.should.not.equal("[]"); /* Should contain atleast one question */
                done();
        });
    });
});
