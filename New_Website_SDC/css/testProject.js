#!/usr/bin/env node

//  FlickrData API Server
//  Author:  Hadiyan Wijaya based on Spatial Data Capture lecture resource
//  Notes:        This API assumes you have an SQL function called DISTANCE defined which can be created by running the following query in MySQL:
//  CREATE FUNCTION distance(a POINT, b POINT) RETURNS double DETERMINISTIC RETURN ifnull(acos(sin(X(a)) * sin(X(b)) + cos(X(a)) * cos(X(b)) * cos(Y(b) - Y(a))) * 6380, 0)

var moment = require('moment');

var portNumber = 8748;

var mysql = require('mysql');

//MySQL connection Variables
var connection = mysql.createConnection({
  host          :'dev.spatialdatacapture.org',
  user          :'ucfnhwi',
  password      :'torajemope',
  database      :'ucfnhwi'
})

connection.connect();

//  Setup the Express Server
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

// Provides the static folders we have added in the project to the web server.
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/images'));

// API End Point to get crime type, lat, long, radius, and time and premise type of the crime happened
      app.get('/crimedata/:lat/:lon/:radius', function (req, res) {
      // Alows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database
      if(req.params.lat != "" && req.params.lon != "" && req.params.radius != ""){

                // Parse the values from the URL into numbers for the query
                var lat = parseFloat(req.params.lat);
                var lon = parseFloat(req.params.lon);
                var radius = parseFloat(req.params.radius);


                // SQL Statement to run
                var sql = "SELECT * FROM crime_data where year(timeseries)>=2019";

                // Log it on the screen for debugging
                console.log(sql);

                // Run the SQL Query
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                // If we have data that comes bag send it to the user.
                                res.send(rows);
                        }else{
                                res.send("");
                        }
                });
                }else{
                // If all the URL variables are not passed send an empty string to the user
                res.send("");
        	}
	});
       


// API end pont to get crimetype at certain date
 app.get('/crimedata/:crimetype', function (req, res) {
      // Alows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database
      if(req.params.crimetype != ""){

                // Parse the values from the URL into numbers for the query
               
                // SQL Statement to run
                var sql = "SELECT MCI, lat, lng, timeseries from crime_data where year(timeseries)>=2019 and MCI like '%"+req.params.crimetype+"%'";

                // Log it on the screen for debugging
                console.log(sql);

                // Run the SQL Query
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                // If we have data that comes bag send it to the user.
                                res.send(rows);
                        }else{
                                res.send("");
                        }
                });
                }else{
                // If all the URL variables are not passed send an empty string to the user
                res.send("");
                }
        });



// API end point to get date at that day
 app.get('/covid_cases/:date', function (req, res) {
      // Alows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database
      if(req.params.date != ""){

                // Parse the values from the URL into numbers for the query
                var date = parseDate(req.params.date);
               
                // SQL Statement to run
                var sql = "SELECT Reported_date FROM covid_cases";
                // Log it on the screen for debugging
                console.log(sql);

                // Run the SQL Query
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                // If we have data that comes bag send it to the user.
                                res.send(rows);
                        }else{
                                res.send("");
                        }
                });
                }else{
                // If all the URL variables are not passed send an empty string to the user
                res.send("");
                }
        });

// API end point to get the crime description for each crime cases
 app.get('/crimedesc/:lat/:long/:radius', function (req, res) {
      // Alows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database
      if(req.params.premises_type != ""){

                // SQL Statement to run
                var sql = "SELECT objectid, timeseries, lat, lng, premises_type, MCI, neighborhood  FROM crime_data where year(timeseries)>=2019 ";

                // Log it on the screen for debugging
                console.log(sql);

                // Run the SQL Query
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                // If we have data that comes bag send it to the user.
                                res.send(rows);
                        }else{
                                res.send("");
                        }
                });
                }else{
                // If all the URL variables are not passed send an empty string to the user
                res.send("");
                }
        });

// API end point to get the covid-19 cases on that day in the city
 app.get('/covidata/:day/:month/:year', function (req, res) {
      // Alows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database
      if(req.params.day != "" && req.params.month != "" && req.params.year != ""){

                // Parse the values from the URL into numbers for the query
                var day = parseInt(req.params.day);
                var month = parseInt(req.params.month);
                var year = parseInt(req.params.year);


                // SQL Statement to run
                var sql = "SELECT Reported_date, cases_per_day FROM covid_cases WHERE day(Reported_date)="+day+" and month(Reported_date)="+month+" and year(Reported_date)="+year+" ";

                // Log it on the screen for debugging
                console.log(sql);

                // Run the SQL Query
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                // If we have data that comes bag send it to the user.
                                res.send(rows);
                        }else{
                                res.send("");
                        }
                });
                }else{
                // If all the URL variables are not passed send an empty string to the user
                res.send("");
                }
        });


// API end point to get the crime cases on that day in the city
 app.get('/crimedata/casesperday/total/:day/:month/:year/:lockdown', function (req, res) {
      // Alows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database
      if(req.params.day != "" && req.params.month != "" && req.params.year != ""){

                // Parse the values from the URL into numbers for the query
                var day = parseInt(req.params.day);
                var month = parseInt(req.params.month);
                var year = parseInt(req.params.year);
		var lockdown = req.params.lockdown;

                // SQL Statement to run
                var sql = "SELECT MCI, count(MCI) as cases FROM crime_data WHERE lockdownStatus= "+lockdown+" and  day(timeseries)="+day+" and month(timeseries)="+month+" and year(timeseries)="+year+" group by(MCI)";

                // Log it on the screen for debugging
                console.log(sql);

                // Run the SQL Query
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                // If we have data that comes bag send it to the user.
                                res.send(rows);
                        }else{
                                res.send("");
                        }
                });
                }else{
                // If all the URL variables are not passed send an empty string to the user
                res.send("");
                }
        });  


	// API end point to get the crime cases on that day in the city
 	app.get('/crimedata/casesperday/:day/:month/:year/:lockdown', function (req, res) {
      	// Alows data to be downloaded from the server with security concerns
      		res.header("Access-Control-Allow-Origin", "*");
      		res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      		// If all the variables are provided connect to the database
      		if(req.params.day != "" && req.params.month != "" && req.params.year != ""){
	
		// Parse the values from the URL into numbers for the query
                var day = parseInt(req.params.day);
                var month = parseInt(req.params.month);
                var year = parseInt(req.params.year);
		var lockdown = req.params.year;


                // SQL Statement to run
                var sql = "SELECT * FROM crime_data WHERE lockdownStatus = "+lockdown+" and day(timeseries)="+day+" and month(timeseries)="+month+" and year(timeseries)="+year+" ";

                // Log it on the screen for debugging
                console.log(sql);

                // Run the SQL Query
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                // If we have data that comes bag send it to the user.
                                res.send(rows);
                        }else{
                                res.send("");
                        }
                });
                }else{
                // If all the URL variables are not passed send an empty string to the user
                res.send("");
                }
        });





















// Setup the server and print a string to the screen when server is ready
var server = app.listen(portNumber, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}






