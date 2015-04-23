/**
 * 
 * 
 * @remarks Filtering is done here, both because it relieves those poor servers of work, and because
 * 			values are considered after the string prefixes are removed
 */
function getInitialTypes(callback) {
	// Query for the initial classes from  owl:Class
	makeSparqlQuery({
		"query": "select ?type { ?type a owl:Class . }"
	}, function(results) {
		console.log("Parsing", results);
		// Create an array of the results, parsed by name
		var types = {},  // Table of original class name to English name
		    values = {}, // Table of English name to parsed, readable name
			array = results.results.bindings.map(function(result) {
				var original = result.type.value,
				    value = original;
				
				// Get the last part of it after the slash
				value = value.slice(value.lastIndexOf('/') + 1);
				
				// Also make sure it's after the pound
				value = value.slice(value.lastIndexOf('#') + 1);
				
				// Mark an entry in the types table, both ways
				types[value] = original;
				types[original] = value;
				
				return value;
			}).filter(function(value) {
				// Don't allow those really long or really short names
				if(value.length <= 3 || value.length > 11) {
					return false;
				}
				
				// Don't allow numbers, dashes, or underscores
				if(value.match(/[0-9_-]/)) {
					return false;
				}
				
				// The first character should be uppercase, but not the second
				if(!isUpperCase(value[0]) || isUpperCase(value[1])) {
				    return false;
				}
				
				// Record values into the values object, to check for duplicates
				if(values.hasOwnProperty(value)) {
					return false;
				} else {
					values[value] = true;
					return true;
				}
			})
			// Pluralize everything, and map from the original class to that
			.map(function(original) {
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
			.filter(function(value) {
			    var split = value.split(/[ ,]+/),
				i;
			    for(i = split.length - 1; i >= 0; --i) {
				if(split[i].length === 1) {
				    return false;
				}
			    }
	    		    return true;
			})
			.sort();
		
		// The callback is run synchronously on [array, values, types]
		callback && callback(array, values, types);
	});
}

/**
 * 
 */
function getTypeAssociations(type, callback) {
	var query = "";
	query += "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ";
	query += "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ";
	query += "SELECT * WHERE ";
	query += "{ ";
	query += "	 <http://dbpedia.org/resource/David_Beckham> ?p ?o . ";
	query += " 	 FILTER(?p != rdf:type && ?p != rdfs:comment && ?p != rdfs:label) ";
	query += "}";

	makeSparqlQuery({
		"query": query
	}, function() {
		console.log("Got back assoc", arguments);
	});

}

/* Utilities
*/

/**
 *
 *
 * @remarks Source query:
 * http://dbpedia.org/sparql/
 * 		?default-graph-uri=http%3A%2F%2Fdbpedia.org
 * 		&query=select+%3Ftype+%7B%0D%0A+++%3Ftype+a+owl%3AClass+.%0D%0A%7D
 * 		&format=application%2Fsparql-results%2Bjson
 * 		&timeout=30000
 * 		&debug=on
 */
function makeSparqlQuery(settings, callback) {
	var ajax = new XMLHttpRequest(),
		url = "http://dbpedia.org/sparql/";
	
	// Start the base URL parameters
	url += "?default-graph-url=http%3A%2F%2Fdbpedia.org";
	url += "&format=application%2Fsparql-results%2Bjson";
	url += "&timeout=3000";
	
	// Add the actual SPARQL query 
	url += "&query=" + encodeURIComponent(settings.query); 
	
	// Send the request out
	console.log("Querying DBpedia:", url);
	ajax.open("GET", url, true);
	ajax.send();
	ajax.onreadystatechange = function() {
		if(ajax.readyState != 4) {
			return;
		}
		console.log("Got a result for", url);
		
		callback && callback(JSON.parse(ajax.responseText));
	}
}

function isUpperCase(str) {
    return str === str.toUpperCase();
}
