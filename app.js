var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var MongoDBUtil = require('./modules/mongodb/mongodb.module').MongoDBUtil;

var UserController = require('./modules/user/user.module')().UserController;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

MongoDBUtil.init();

app.use('/users', UserController);

app.get('/', function (req, res) {
    var pkg = require(path.join(__dirname, 'package.json'));
    res.json({
        name: pkg.name,
        version: pkg.version,
        status: 'up'
    });
});

app.get('/home', function(req, res) {
    res.render('pages/home', {
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    res.json({
        message: res.locals.message,
        error: res.locals.error
    });
});

var port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log('Servidor escuchando en el puerto ' + port);
});

module.exports = app;