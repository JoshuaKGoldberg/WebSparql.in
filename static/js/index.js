(function (settings) {
    document.onreadystatechange = function () {
        if (document.readyState !== "complete") {
            return;
        }

        settings.sparqler = document.querySelector(settings.sparqlerQuery);
        settings.selectors = sparqler.querySelectorAll("select");

        setSelectorOptions(0, "__Classes");
    };

    function setSelectorOptions(index, name) {
        var selector = settings.selectors[index],
            ajax = new XMLHttpRequest(),
		    url = "/api/" + name;

        selector.className = "hidden";
        selector.innerHTML = "<option>Loading...</option>";

        ajax.open("GET", url, true);
        ajax.send();
        ajax.onreadystatechange = function () {
            if (ajax.readyState !== 4) {
                return;
            }

            var dump = JSON.parse(ajax.responseText);

            selector.innerHTML = [
                "<option>Choose one...</option>",
                "<option>",
                dump.array.join("</option><option>"),
                "</option>"
            ].join("")

            selector.className = "visible";

            settings.selectorCallbacks[index](selector, dump, setSelectorOptions);
        }
    }
})({
    "sparqler": undefined,
    "selectors": undefined,
    "sparqlerQuery": "#sparqler",
    "selectorCallbacks": [
        function (selector, dump, setSelectorOptions) {
            selector.onchange = function () {
                if (selector.selectedIndex === 0) {
                    return;
                }

                setSelectorOptions(1, "Person");
            }
        },
        function () {
            console.log("yup");
        }
    ]
});