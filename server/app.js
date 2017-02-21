var express = require('express');

//use express session?
var session = require('express-session');

var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var mustacheExpress = require('mustache-express');

var course = require('./routes/course');
var group = require('./routes/group');
var student = require('./routes/student');
var admin = require('./routes/admin');

var app = express();

//VARIABLES FOR ROUTING FILES GO HERE

app.use(cookieParser());

//testing sessions
app.use(session({
  secret: "yolo",
  resave: true,
  saveUnitialized: true,
  currentUser: ""
}));

app.use('/public', express.static(path.join(__dirname, '/public')));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', mustacheExpress()) // Same as file extensions (*.html)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//ROUTING SETUP
app.use('/course', course);
app.use('/groups', group);
app.use('/student', student);
app.use('/admin', admin);

app.listen(3000, function() {
    console.log("Listening at port 3000");
});

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});

app.use(function(err, req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
})

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
