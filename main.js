var express = require("express"),
    url = require("url"),
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

// Redirect everything to the /static/ dir (because of indexOptions)
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
