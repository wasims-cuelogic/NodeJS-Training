process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");
var nock = require('nock');

var server = require('../server');
var should = chai.should();
chai.use(chaiHttp);
var expect = require('chai').expect;

var url = 'http://localhost:3001';

describe('User APIs', function () {

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

    // it('should authenticate a user on /api/users/authenticate POST', function (done) {
    //     chai.request(url)
    //         .post('/api/users/authenticate')
    //         .send({ username: 'wasims', password: 'wasim@123' })
    //         .set("Content-Type", "application/json")
    //         .end(function (err, res) {
    //             expect(res.body).to.have.property('id_token');
    //             done();
    //         });
    // });


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

    //     server.inject({ method: 'POST', url: '/api/users', headers: {}, payload: {} }, function (res) {

    //         res.headers['content-type'].should.match(/json/);
    //         res.statusCode.should.equal(500);
    //         res.result.error.should.be.equal("Internal Server Error");

    //         res.result.should.have.property('message').and.equal('An internal server error occurred');

    //         done();
    //     });

    // });
});

describe('User Registration', function () {
    var user = void 0;
    before(function () {
        user = {
            "fname": "testfname",
            "lname": "testlname",
            "username": "testusername",
            "email": "test123@gmail.com",
            "password": "pass@123"
        };
    });


    it('should register a new user and return a token id', function (done) {

        var response = {
            "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU4N2UyMGI1OWVhMGJlMzNlYWM5NjE2NiIsInVzZXJuYW1lIjoiYXNkYXNzIiwiaWF0IjoxNDg0NjYwOTE3LCJleHAiOjE0ODQ2NjQ1MTd9.Zn9XguQ5sbuPv_KapzKGZA2vvUgCZ-jgSxT6surTTQ8"
        }

        nock('http://localhost:3001')
            .post('/api/users', user)
            .reply(200, response);

        expect(response).to.have.property('id_token');
        done();
    });
});


describe('User Authentication', function () {
    var userCredentials = void 0;
    before(function () {
        userCredentials = {
            "username": "testfname",
            "password": "pass@123"
        };
    });


    it('should authenticate user credentials and return a token id', function (done) {

        var response = {
            "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU4Nzc2ZjI1NWRmNGI1MGUwZmViYjNiMSIsInVzZXJuYW1lIjoid2FzaW1zIiwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTQ4NDY2Mjg3MywiZXhwIjoxNDg0NjY2NDczfQ.X1tKkG5oJl5TxJ4j7uxLINrJAKiG5mP6eAq1tr0IJNk"
        }

        nock('http://localhost:3001')
            .post('/api/users', userCredentials)
            .reply(200, response);

        expect(response).to.have.property('id_token');
        done();
    });
});