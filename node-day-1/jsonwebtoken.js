// sign with default (HMAC SHA256) 
var jwt = require('jsonwebtoken');
var fs = require("fs");
var token = jwt.sign({ foo: 'bar' }, 'test');
//backdate a jwt 30 seconds 
var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'test');
 
// sign with RSA SHA256 
var cert = fs.readFileSync('private.key');  // get private key 
var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'});
 
// sign asynchronously 
jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' }, function(err, token) {
  console.log("Generated key is ",token);


});