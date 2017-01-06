var log = {
    info: function (info) {
        console.log('Info: ' + info);
    },
    warning: function (warning) {
        console.log('Warning: ' + warning);
    },
    error: function (error) {
        console.log('Error: ' + error);
    }
};

module.exports = log


var testVar = "This is a string";

console.log(`String is ${testVar}`);
console.log("1=>", process.argv.length);
console.log(process.argv);
