var credentials = require('./credentials.json');

var mysql=require("mysql");

credentials.host="ids";
var connection = mysql.createConnection(credentials);
var data = {};
var processed = {};

sql = "SHOW DATABASES";

function allZero(object){
	allzero = true;
	for (obj in object){
		if (object[obj] != 0){
			allzero = false
		}
	}
	return (allzero);
}

function processDescription(desc, table, dbf){
	data[dbf]--; //Processed one table
	if (processed[dbf] == 0){
		processed[dbf] = 1
		console.log('---|' + dbf + '>');
	}
	console.log('.....|' + dbf + '.' + table + '>');
	desc.map(function(field){
		console.log("\tFieldName: `" + field.Field + "` \t(" + field.Type + ")");
});
	if(allZero(data)){connection.end()}
}

function processTables(tables,dbf) {
	data[dbf] = tables.length;
	processed[dbf] = 0;
	for(var index in tables) {
		var tableObj = tables[index];
		for(key in tableObj)
			var table = tableObj[key];
			table = dbf + "." + table;
			var sql = "DESCRIBE " + table;
			connection.query(sql, (function(table,dbf) {
				return function(err, desc, fields) {
					if(err) {
						console.log("Error describing table " + table);
					} else {
						processDescription(desc,table,dbf);
					}
				};
			})(table,dbf));
		}
	}


function processDBFs(dbfs) { //Asynch row handler
	for(var index in dbfs)
		var dbf = dbfs[index].Database;
		var sql = 'SHOW TABLES IN ' + dbf;
		data[dbf] = Number.POSITIVE_INFINITY; //Exists, but not set.
		connection.query(sql, (function(dbf) {
			return function(err, tables, fields){
				if(err) {
					console.log("Error finding tables in dbf " + dbf);
					connection.end();
				} else {
					processTables(tables,dbf);
				}
			};
		})(dbf));
}

connection.connect(function(err) {
	if(err){
		console.log("Problems with MySQL: "+err);
	} else {
		console.log("Connected to Database.");
	}
});

connection.query(sql, function(err,rows,fields){ //connection.connect() is run automatically for query
	if(err){
		console.log('Error looking up databases.');
		connection.end();
	} else {
		processDBFs(rows); //Get called once...so it is safe!
	}
});

console.log("All done now.");
