var fs = require("fs"),
    pluralize = require("pluralize");

module.exports = {
    "results": {},
    "getDump": function (name) {
        if (!this.results.hasOwnProperty(name)) {
            console.log("a");
            this.results[name] = this.obtainDumpData(name);
        }
        return this.results[name];
    },
    "obtainDumpData": function (name) {
        var filename = __dirname + "/../dumps/" + name + ".json";
        return this.obtainDumpResults(JSON.parse(fs.readFileSync(filename, {
            "encoding": "UTF-8"
        })));
    },
    "obtainDumpResults": function (dump) {
        var dumps = this,
            types = {},  // Table of original class name to English name
            values = {}, // Table of English name to parsed, readable name
            key = dump.head.vars[0],
            array = dump.results.bindings.map(function (result) {
                var original = result[key].value,
                    value = original;

                // Get the last part of it after the slash
                value = value.slice(value.lastIndexOf("/") + 1);

                // Also make sure it's after the pound
                value = value.slice(value.lastIndexOf("#") + 1);

                // Mark an entry in the types table, both ways
                types[value] = original;
                types[original] = value;

                return value;
            }).filter(function (value) {
                // Don't allow those really long or really short names
                if (value.length <= 3 || value.length > 11) {
                    return false;
                }

                // Don't allow numbers, dashes, or underscores
                if (value.match(/[0-9_-]/)) {
                    return false;
                }

                // Record values into the values object, to check for duplicates
                if (values.hasOwnProperty(value)) {
                    return false;
                } else {
                    values[value] = true;
                    return true;
                }
            })
            // Pluralize everything, and map from the original class to that
            .map(function (original) {
                var value = original;

                // Insert a space before each capital letter after the first
                value = value[0] + value.slice(1).replace(/([A-Z])/g, " $1");

                // Pluralize the word
                value = pluralize(value);

                // Mark an entry in the values hash table
                values[original] = value;

                return value;
            })
            // Remove classes with one-letter parts (like "Product i ds")
            .filter(function (value) {
                var split = value.split(/[ ,]+/),
                i;
                for (i = split.length - 1; i >= 0; --i) {
                    if (split[i].length === 1) {
                        return false;
                    }
                }
                return true;
            });

        array.sort();

        return {
            "array": array,
            "types": types,
            "values": values
        }
    },
    "isUpperCase": function (str) {
        return str.toUpperCase() === str;
    },
    "isLowerCase": function (str) {
        return str.toLowerCase() === str;
    }
};