// Your node app

// Require the bcrypt package
var bcrypt = require('bcrypt');

// Create a password salt
var salt = bcrypt.genSaltSync(10);

// Salt and hash password
var passwordFromUser = "wasim@123";

var passwordToSave = bcrypt.hashSync(passwordFromUser, salt);

console.log("Hashed password ", passwordToSave);

var passwordEnteredByUser = "wasim@123";

if (bcrypt.hashSync(passwordEnteredByUser, salt) === passwordToSave ){
    console.log("Valid password");
}
else {
    console.log("Invalid password");
}
    


