var nock = require('nock');
var request = require('supertest')("http://localhost:3001");
var expect = require('chai').expect;
var nock = require('nock');
var app = require('../server'); // your server.js file

describe("users", function () {

    var users = [
        {
            "_id": "58776f255df4b50e0febb3b1",
            "admin": true,
            "username": "wasims",
            "email": "wasim.sayyed@cuelogic.com",
            "lname": "wasim666666",
            "fname": "Wasim",
            "reg_time": "2017-01-12T11:57:25.240Z"
        }
    ]

    before(function () {

        reqheaders = {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU4Nzc2ZjI1NWRmNGI1MGUwZmViYjNiMSIsInVzZXJuYW1lIjoid2FzaW1zIiwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTQ4NDI4OTEyOSwiZXhwIjoxNDg0MjkyNzI5fQ.sAPTeW5EdiUpWjXz1eY91mTVzYhuN8mrw_RhhjsCHDg",
        }

    });

    it("returns a successful mocked response", function (done) {

        //specify the url to be intercepted
        nock("http://localhost:3001")
            //define the method to be intercepted
            .get('/api/users/')
            //respond with a OK and the specified JSON response
            .reply(200, {
                "status": 200,
                "message": "This is a mocked response"
            });

        //perform the request to the api which will now be intercepted by nock
        request
            .get('/api/users/')
            .end(function (err, res) {
                //assert that the mocked response is returned
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.equal("This is a mocked response");
                done();
            });
    })
});