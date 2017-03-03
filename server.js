var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejslay = require('express-ejs-layouts');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/users');
//mongoose.connect('mongodb://localhost/portfolios');

var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var portfolios = require('./routes/portfolios');

//Init App
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(ejslay);

//bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));


//Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

//Connect flash
app.use(flash());

//Global Vars "res.locals"
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); //for passport
  res.locals.user = req.user || null;
  next();
});

// collections
app.use('/', routes);
app.use('/users', users);
app.use('/portfolios', portfolios);

//Set Port
app.set('port', (process.env.PORT||3000));

app.listen(app.get('port'), function(){
  console.log('Magic happens on port '+ app.get('port'));
});
