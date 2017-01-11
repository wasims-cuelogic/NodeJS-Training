var Promise = require('bluebird');
var fs = require('fs');

var A = function () {
    return new Promise(function (resolve, reject) {
        var result = "A is done";

        console.log(result);
        resolve(result);
    })
}

var B = function () {

    return new Promise(function (resolve, reject) {
        var result = 'B is done'

        setTimeout(function () {
            console.log(result)
            resolve(result);
        }, 2000)
    })
}

var C = function () {

    return new Promise(function (resolve, reject) {
        var result = 'C is done'
        console.log(result)
        resolve(result);
    })
}

var D = function () {

    return new Promise(function (resolve, reject) {
        var result = 'D is done'
        console.log(result)
        resolve(result);
    })
}

A()
    .then(function (result) {
        console.log("A result", result);
        return B();
    })
    .then(C)
    .then(D)



// this is how you read a file without promisify
fs.readFile('input.txt', function (err, buffer) {
    console.log('fs.readFile: ' + buffer.toString());
});

// this is the promisified version
var promisifiedRead = Promise.promisify(fs.readFile);
promisifiedRead('input.txt')
    .then(function (buffer) {
        console.log('promisified readFile: ' + buffer.toString());
    });