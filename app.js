// all imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var mongoose = require('mongoose');
const session = require('express-session');
const exphbs = require('express-handlebars');

const flash = require('connect-flash');
const bodyParser = require('body-parser');
const passport = require('passport');
var app = express();


// database connection
mongoose.Promise = global.Promise;
var configDB = require('./config/database.js');
mongoose.connect(configDB.url)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

///////////////////////////////

// view engine setup
var indexRouter = require('./routes');
var usersRouter = require('./routes/users');

///////////////////////////////////////////////////////////

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

////////////////////////////////////////////////////////////
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());



// ---------------------- PASSPORT ----------------------- //

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


///////////////////////////////////////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.user = req.user || null;
  next();
});

app.use('/',indexRouter);
app.use('/users',usersRouter);




module.exports = app;
