var app = require("express");
var server = require("http").Server(app);
var io = require("socket.io")(server);

io.on("connection", function (socket) {
    var tweet = { user: "nodesource", text: "Hello, world!" };

    // to make things interesting, have it send every second
    var interval = setInterval(function () {
        socket.emit("tweet", tweet);
    }, 1000);

    socket.on("disconnect", function () {
        clearInterval(interval);
    });
});

app.listen(8000);