'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let state = {
  cam1: {
    camId: 'cam1',
    pan: 100,
    tilt: 200,
    zoom: 300
  },

  cam2: {
    camId: 'cam2',
    pan: 300,
    tilt: 400,
    zoom: 500
  },

  cam3: {
    camId: 'cam3',
    pan: 900,
    tilt: 800,
    zoom: 700
  },

  cam4: {
    camId: 'cam4',
    pan: 600,
    tilt: 200,
    zoom: 0
  }
}

app.get('/api/camera/:id', function(req, res, rej) {
  res.json(state[req.params.id]);
});

app.post('/api/camera/:id', function(req, res, rej) {
  console.log(req.body);
  state[req.params.id] = req.body;
  console.log(state);
  res.json({
    status: 'ok',
    camId: req.params.id,
    got: req.query
  })
})

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json( {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
