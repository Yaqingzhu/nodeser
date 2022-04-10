const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
  
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'database-2.cdvfcxgckpci.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: '12345678',
  database: 'android'
});

// New app using express module
const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
  
app.get("/top", function(req, res) {
  var id = req.query.id;
  pool.getConnection(function(err, connection){
    let query = "SELECT * FROM scores WHERE id = ? ORDER BY score DESC LIMIT 5 ";
    let todo = [id];
    connection.query(query, todo, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }

      const converted = JSON.parse(JSON.stringify(results))

      const result = converted.map((i)=>{
        return i.score;
      });

      res.send(result);
    });
  })
});

app.get("/image", function(req, res) {
  var id = req.query.id;
  pool.getConnection(function(err, connection){
    let query = "SELECT * FROM images WHERE id = ? ORDER BY ind DESC LIMIT 1";
    let todo = [id];
    connection.query(query, todo, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }

      const converted = JSON.parse(JSON.stringify(results))

      const result = converted.map((i)=>{
        return i.uri;
      });

      res.send(result);
    });
  })
});

app.get("/topg", function(req, res) {
  pool.getConnection(function(err, connection){
    let query = "SELECT * FROM scores ORDER BY score DESC LIMIT 5 ";
    let todo = [""];
    connection.query(query, todo, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }

      const converted = JSON.parse(JSON.stringify(results))

      const result = converted.map((i)=>{
        return i.score;
      });

      res.send(result);
    });
  })
});
  
app.post("/score", function(req, res) {
  var id = req.body.id;
  var score = Number(req.body.num2);
    
  pool.getConnection(function(err, connection){
    let query = "INSERT INTO scores(id, score) VALUES (?,?)";
    let todo = [id, score];
    connection.query(query, todo, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
    });
  })
    
  res.send("inserted");
});

app.post("/images", function(req, res) {
  var id = req.body.id;
  var uri = req.body.uri;
    
  pool.getConnection(function(err, connection){
    let query = "INSERT INTO images(id, uri) VALUES (?,?)";
    let todo = [id, uri];
    connection.query(query, todo, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
    });
  })
    
  res.send("inserted");
});
  
app.listen(3000, function(){
  console.log("server is running on port 3000");
})