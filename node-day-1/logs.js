var emitter = require('events').EventEmitter;

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


function LoopProcessor(num) {
    var e = new emitter();

    setTimeout(function () {

        for (var i = 1; i <= num; i++) {
            e.emit('BeforeProcess', i);

            console.log('Processing number:' + i);

            e.emit('AfterProcess', i);
        }
    }, 2000)

    return e;
}

var lp = LoopProcessor(3);

lp.on('BeforeProcess', function (data) {
    console.log('About to start the process for ' + data);
});

lp.on('AfterProcess', function (data) {
    console.log('Completed processing ' + data);
});
