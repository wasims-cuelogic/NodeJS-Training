var express = require('express');
var greet = require('./greet');
var goodBye = require('./greet');

require("./john");
require("./doe");

var app = express();

app.get('/', function(req,res) {
    res.send("Hello World");
});

app.listen(8000, console.log("Listening at port 8000"));

greet.greet();

goodBye.sayHello();