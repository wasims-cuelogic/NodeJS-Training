process.env.NODE_ENV = 'test';

var User = require("../api/users/model/User");
var chai = require("chai");
var assert = chai.assert;
var request = require('supertest');
var app = require('../server');
var should = require('should');

describe("User Schema", function () {
    it("should have first name", function (done) {
        var user = new User();
        user.validate(function (err) {
            assert.property(err.errors, "fname");
            done();
        });
    });
    it("should have last name", function (done) {
        var user = new User();
        user.validate(function (err) {
            assert.property(err.errors, "lname");
            done();
        });
    });
    it("should have username", function (done) {
        var user = new User();
        user.validate(function (err) {
            assert.property(err.errors, "username");
            done();
        });
    });
    it("should have email", function (done) {
        var user = new User();
        user.validate(function (err) {
            assert.property(err.errors, "email");
            done();
        });
    });
    it("should have password", function (done) {
        var user = new User();
        user.validate(function (err) {
            assert.property(err.errors, "password");
            done();
        });
    });

});


