var express = require("express"),
    pluralize = require("pluralize"),
    dumps = require("./js/dumps.js")
    app = express(),
    indexOptions = {
        "root": __dirname + "/static/",
        "dotfiles": "deny",
        "headers": {
            "x-timestamp": Date.now(),
            "x-sent": true
        }
    };

app.set("port", (process.env.PORT || 5000));
app.use(express.static(__dirname + "/public"));

app.get("/api/*", function (request, response) {
    var name = request.url.slice(request.url.lastIndexOf("/") + 1),
        dump = dumps.getDump(name);

    console.log("Doing", dump);

    response.end(JSON.stringify(dump));
});

// Redirect everything else to the /static/ dir (because of indexOptions)
app.get("*", function (request, response) {
    response.sendFile(request.url, indexOptions, function () {
        response.end();
    });
});

//// 404 page: index.html
//app.error(function (error, request, result, next) {
//    response.sendFile("404.html", indexOptions, function () {
//        response.end();
//    });
//});

app.listen(app.get("port"), function () {
    console.log("Server running at " + app.get("port"));
});