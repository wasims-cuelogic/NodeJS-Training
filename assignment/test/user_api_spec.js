process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var server = require('../server');
var should = chai.should();
chai.use(chaiHttp);
var expect = require('chai').expect;

var url = 'http://localhost:3001';

describe('User', function () {

    it('should give Username Already Present response on /api/users POST', function (done) {
        chai.request(url)
            .post('/api/users')
            .set("Content-Type", "application/json")
            .send({
                "fname": "testfname",
                "lname": "testlname",
                "username": "testusername",
                "email": "test123@gmail.com",
                "password": "pass@123"

            })
            .end(function (err, res) {

                expect(res.body.statusCode).to.equal(400);
                expect(res.body.error).to.equal("Bad Request");
                expect(res.body.message).to.equal("Username taken");
                done();
            });
    });

    it('should give Unauthorized Access response on /api/users GET', function (done) {
        chai.request(url)
            .get('/api/users')
            .set("Content-Type", "application/json")
            .end(function (err, res) {

                expect(res.body.statusCode).to.equal(401);
                expect(res.body.error).to.equal("Unauthorized");
                expect(res.body.message).to.equal("Missing authentication");
                done();
            });
    });


    it('should give Expired token received for JSON Web Token validation on /api/users GET', function (done) {
        chai.request(url)
            .get('/api/users')
            .set("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU4Nzc2ZjI1NWRmNGI1MGUwZmViYjNiMSIsInVzZXJuYW1lIjoid2FzaW1zIiwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTQ4NDYzNzY5NCwiZXhwIjoxNDg0NjQxMjk0fQ.UPjNjqVBVZRnj9bN5nvrFl9xIjyCYtmd8Th6_QiIrvU")
            .set("Content-Type", "application/json")
            .end(function (err, res) {

                expect(res.body.statusCode).to.equal(401);
                expect(res.body.error).to.equal("Unauthorized");
                expect(res.body.message).to.equal("Expired token received for JSON Web Token validation");
                done();
            });
    });

    it('should authenticate a user on /api/users/authenticate POST', function (done) {
        chai.request(url)
            .post('/api/users/authenticate')
            .send({ username: 'wasims', password: 'wasim@123' })
            .set("Content-Type", "application/json")
            .end(function (err, res) {
                expect(res.body).to.have.property('id_token');
                done();
            });
    });


    // it('should return users array on /api/users GET', function (done) {
    //     chai.request(url)
    //         .get('/api/users')
    //         .set("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU4Nzc2ZjI1NWRmNGI1MGUwZmViYjNiMSIsInVzZXJuYW1lIjoid2FzaW1zIiwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTQ4NDY1MjU3OSwiZXhwIjoxNDg0NjU2MTc5fQ.W7fPvRRfsi0_KZwJDEm9uYOaIq968gLogANdN2sVN08")
    //         .set("Content-Type", "application/json")
    //         .end(function (err, res) {
    //             expect(res.body).to.be.an('array');
    //             done();
    //         });
    // });




    // it('should add a SINGLE user on /api/users POST', function (done) {
    //     chai.request(url)
    //         .post('/api/users')
    //         .set("Content-Type", "application/json")
    //         .send({
    //             "fname": "testfname",
    //             "lname": "testlname",
    //             "username": "testusername",
    //             "email": "test123@gmail.com",
    //             "password": "pass@123"

    //         })
    //         .end(function (err, res) {
    //             res.status.should.be.equal(201);
    //             res.body.should.have.property('id_token');
    //             res.should.be.json;
    //             done();
    //         });
    // })

    // it('should add a SINGLE user on /api/users POST', function (done) {

    //     server.inject({ method: 'POST', url: '/api/users', headers: {}, payload: {} }, function (res) {

    //         res.headers['content-type'].should.match(/json/);
    //         res.statusCode.should.equal(500);
    //         res.result.error.should.be.equal("Internal Server Error");

    //         res.result.should.have.property('message').and.equal('An internal server error occurred');

    //         done();
    //     });

    // });
});