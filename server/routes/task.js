var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var config = {
  database: 'chi', // name of your database
  host: 'localhost', // where is your database?
  port: 5432, // port for the database
  max: 10, // how many connections at one time
  idleTimeoutMillis: 30000 // 30 seconds to try to connect
};

var pool = new pg.Pool(config);

router.get('/', function(req, res){
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      db.query('SELECT * FROM weekend3_tasks ORDER BY "completed" ASC;', function(queryError, result){
        done();
        if(queryError) {
          console.log('Error making query.');
          res.send(500);
        } else {
          console.log(result.rows);
          res.send(result.rows);
        }
      });
    }
  });
});

router.put('/edit', function(req, res){
  var id = Number(req.body.id);
  var task = req.body.task;
  var priority = req.body.priority;
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      db.query('UPDATE weekend3_tasks ' +
                'SET task=$1, priority=$2 WHERE id=$3;',
                [task, priority, id], function(queryError, result){
                done();
        if(queryError) {
          console.log('Error making query.');
          res.sendStatus(500);
        } else {
          console.log(result.rows);
          res.sendStatus(200);
        }
      });
    }
  });
});

router.put('/completed', function(req, res){
  var id = Number(req.body.id);
  var task = req.body.task;
  var priority = req.body.priority;
  var completed = req.body.completed;
  if (completed === 'false'){
    completed = 'true';
  } else {
    completed = 'false';
  }
  console.log(completed);
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      db.query('UPDATE weekend3_tasks ' +
                'SET task=$1, priority=$2, completed=$3 WHERE id=$4;',
                [task, priority, completed, id], function(queryError, result){
                done();
        if(queryError) {
          console.log('Error making query.');
          res.sendStatus(500);
        } else {
          res.sendStatus(200);        }
      });
    }
  });
});

router.post('/add', function(req, res){
var task = req.body.task;
var priority = req.body.priority;
var completed = req.body.completed;
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      // We connected!!!!
      db.query('INSERT INTO weekend3_tasks (task, priority, completed) VALUES ($1, $2, $3);', [task, priority, completed], function(queryError, result){
        done();
        if(queryError) {
          console.log('Error making query.');
          res.sendStatus(500);
        } else {
          console.log(result); // Good for debugging
          res.sendStatus(200);
        }
      });
    }
  });
});

router.delete('/delete/:id', function(req, res){
  var id = req.params.id;
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      // We connected!!!!
      db.query('DELETE FROM weekend3_tasks WHERE id=$1;', [id], function(queryError, result){
        done();
        if(queryError) {
          console.log('Error making query.');
          res.send(500);
        } else {
          console.log(result); // Good for debugging
          res.sendStatus(200);
        }
      });
    }
  });
});

module.exports = router;
