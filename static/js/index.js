(function () {
    document.onreadystatechange = function () {
        if (document.readyState !== "complete") {
            return;
        }

        var sparqler = document.querySelector("#sparqler"),
            selectors = sparqler.querySelectorAll("select");

        setSelectorOptions(selectors[0], "Classes");
    };

    function setSelectorOptions(selector, name) {

    }
})();