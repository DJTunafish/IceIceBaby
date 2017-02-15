var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var mustacheExpress = require('mustache-express');

var course = require('./routes/course');

var app = express();

//VARIABLES FOR ROUTING FILES GO HERE

app.use(cookieParser());

app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(express.static('public'))

app.set('views', path.join(__dirname, 'views'));
app.engine('html', mustacheExpress()) // Same as file extensions (*.html)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//ROUTING SETUP
app.use('/courses', course);

app.listen(8080, function() {
    console.log("Listening at port 8080");
});


// Exception handling
if (app.get('env') === 'development') {
    console.log("In development mode");
    app.use(function(err, req, res, next) {
        console.log("Error:" + err.stack);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}