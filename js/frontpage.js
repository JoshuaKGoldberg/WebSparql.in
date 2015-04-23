function setThingOptions() {
    getInitialTypes(function(types, values, originals) {
        var elem = document.getElementById("things"),
            output = "<option>" + types.join("</option><option>") + "</option>";
        
        things.innerHTML = output;
        
        things.selectedIndex = Math.floor(Math.random() * types.length);
        
        console.log("Finished with", types, values, originals);
    });
}
