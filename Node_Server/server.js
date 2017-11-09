var express = require('express');
const { Pool, Client } = require('pg')
var app = express();

// connection details (pw will need hiding later)
connectionString = 'postgresql://postgres:password@localhost:5432/leicester_routing';

// create Pool object for connections
const pool = new Pool({
  connectionString: connectionString
});

app.get('/route', function (req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('unable to connect to database: ' + err);
      res.status(400).send(err);
    }
    console.log(req.query.destination);
    var tmpQuery = `SELECT * FROM ways where source = ${req.query.destination}`;
    client.query(tmpQuery, function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.json(result.rows);
    });
  });
});

app.listen(4000, function () {
  console.log('Server is running.. on Port 4000');
});
