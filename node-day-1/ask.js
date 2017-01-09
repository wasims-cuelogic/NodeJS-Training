var questions = [
    "What is your name ?",
    "What is your hobby ?",
    "What is your preferred language ? "
];

var answers = [];

function ask(i) {
    process.stdout.write(`\n ${questions[i]}`);
    process.stdout.write(" > ");
}

process.stdin.on('data', function(data) {
    answers.push(data.toString().trim());

    if(answers.length < questions.length){
        ask(answers.length);
    }
    else {
        process.exit();
    }
});

ask(0);