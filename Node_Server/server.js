var express = require('express');
const { Pool, Client } = require('pg')
var app = express();

// connection details
connectionString = 'postgresql://postgres:admin@localhost:5432/greencar_uol';

// create Pool object for connections
const pool = new Pool({
  connectionString: connectionString
});

app.listen(4000, function () {
  console.log('Server is running.. on Port 4000');
});

// Allow access via GET/POST methods etc
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Allow access via http://localhost:4000/route
app.get('/route', function (req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('unable to connect to database: ' + err);
      res.status(400).send(err);
    }
    var tmpQuery = `SELECT * FROM ways where source = ${req.query.source}`;
    client.query(tmpQuery, function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.json(result.rows);
      client.release();
    });
  });
});

// Allow access via http://localhost:4000/neighbours
app.get('/neighbours', function (req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('unable to connect to database: ' + err);
      res.status(400).send(err);
    }
    var tmpQuery = `SELECT * FROM ways where source = ${req.query.nodeID} OR target = ${req.query.nodeID}`;
    client.query(tmpQuery, function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.json(result.rows);
      client.release();
    });
  });
});

// Allow access via http://localhost:4000/node
app.get('/node', function (req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('unable to connect to database: ' + err);
      res.status(400).send(err);
    }
    var tmpQuery = `SELECT * FROM ways_vertices_pgr where id = ${req.query.nodeID}`;
    client.query(tmpQuery, function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.json(result.rows);
      client.release();
    });
  });
});

app.get('/allNode', function (req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('unable to connect to database: ' + err);
      res.status(400).send(err);
    }
    var tmpQuery = `SELECT * FROM ways_vertices_pgr`;
    client.query(tmpQuery, function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.json(result.rows);
      client.release();
    });
  });
});

app.get('/allEdge', function (req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('unable to connect to database: ' + err);
      res.status(400).send(err);
    }
    var tmpQuery = `SELECT * FROM ways`;
    client.query(tmpQuery, function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.json(result.rows);
      client.release();
    });
  });
});
