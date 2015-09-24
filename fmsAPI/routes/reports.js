var express = require('express');

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:admfms@localhost:5432/fixmystreet';


var reportsRouter = function(){
  var reportRouter = express.Router();

  reportRouter.route('/')
  /*.post(function(req, res){
  ``var book = new Book(req.body);


    book.save();
    res.status(201).send(book);
  ``
  })*/
  .get(function(req,res){
    var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
      // SQL Query > Select Data
      var query = client.query("SELECT * FROM problem ORDER BY id ASC;");

      // Stream results back one row at a time
      query.on('row', function(row) {
        results.push(row);
      });
      // After all data is returned, close connection and return results
      query.on('end', function() {
        client.end();
        return res.json(results);
      });
      // Handle Errors
      if(err) {
        console.log(err);
      }
    });
  });

reportRouter.route('/:problem_id')
  .get(function(req,res){
    // Get a Postgres client from the connection pool
    var problem_id = req.params.problem_id;
    var results = [];
    pg.connect(connectionString, function(err, client, done) {

      // SQL Query > Select Data
      console.log('problemID = ' + problem_id);
      var query = client.query("SELECT * FROM problem WHERE id=" + String(problem_id) + ";");
      //var query = client.query("SELECT * FROM problem" +  ";");

      var queryComments = client.query("SELECT * FROM comment WHERE problem_id=" +String(problem_id) + ";");
      // Stream results back one row at a time
      query.on('row', function(row) {
        results.push(row);
        results[0].comments = [];
        //var queryComments = client.query("SELECT * FROM comments WHERE problem_id=" +String(problem_id) + ";");

        queryComments.on('row', function(row) {
          console.log(row);
          results[0].comments.push(row);
        });
      });
      // After all data is returned, close connection and return results
      queryComments.on('end', function() {
        client.end();
        return res.json(results);
      });

      // Handle Errors
      if(err) {
        console.log(err);
      }
    });
  });// end of get
  reportRouter.route('/:problem_id/comments')
    .get(function(req,res){
      // Get a Postgres client from the connection pool
      var problem_id = req.params.problem_id;
      var results = [];
      pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        console.log('comments for problemID = ' + problem_id);
        var query = client.query("SELECT * FROM comment WHERE problem_id=" + String(problem_id) + ";");

        // Stream results back one row at a time
        query.on('row', function(row) {
          results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
          client.end();
          return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

      });
    }); // end of comments
return reportRouter;
};

module.exports = reportsRouter;
