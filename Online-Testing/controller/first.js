var express = require('express');
var app = express();
var bodyParser =  require('body-parser');
var mysql = require('mysql');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/admin";

const urlencodedParser = bodyParser.urlencoded({extended: false})
var connection = mysql.createConnection
({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'user'
});


app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});
app.use(bodyParser.json());


app.post('/route',urlencodedParser, function(req,res){
var x=JSON.stringify(req.body)
	var data=JSON.parse(x);
	console.log(data.name);
	connection.connect(function(err) {
  		if (err) throw err;
  		console.log("Connected!");


  		var sql = "Insert into  users (name,password) VALUES ('"+data.name+"', '"+data.password+"')";
  		connection.query(sql, function (err, result) {
   		 	if (err) throw err;
   		 	console.log("1 record inserted");
  		});
	});

	res.send("passwords equal bravo");

});


app.listen(3000);
