var express   = require('express');
var pg = require('pg');

var connString = "postgres://postgres:password@localhost:5432/leicester-osm";

app.get('/', function (req, res, next) {
  pg.connect(connString, function(err, client, done) {
    if(err){
      console.log('unable to connect to database: ' + err);
      res.status(400).send(err);
    }
    client.query('')
  });
});
