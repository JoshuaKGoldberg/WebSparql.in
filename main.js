var express = require("express"),
    app = express();

app.set("port", (process.env.PORT || 5000));
app.use(express.static(__dirname + "/public"));

app.get("/", function (request, response) {
    response.set('Content-Type', 'text/html');
    response.write("Hello world.");
    response.end();
});

app.listen(app.get("port"), function () {
    console.log("Server running at " + app.get("port"));
});
