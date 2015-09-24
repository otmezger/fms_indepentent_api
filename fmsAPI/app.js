
// requires
var express = require('express');
var bodyParser = require('body-parser');

var reportsRouter = require('./routes/reports');

// start app

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:true}));




app.use('/api/v1/reports', reportsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers


app.listen(port, function(){
    console.log('Gulp is running my app on  PORT: ' + port);
});
