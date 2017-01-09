var express = require('express');
var boom = require('express-boom');

var app = express();

app.use(boom());

app.use(function (req, res) {
    res.boom.notFound(); // Responds with a 404 status code 
});

app.use(function (req, res) {
    // some validation check fail and returns an object : reasons 

    res.boom.badRequest("Validation didn't suceed", reasons); // Responds Boom message + reasons object 
});