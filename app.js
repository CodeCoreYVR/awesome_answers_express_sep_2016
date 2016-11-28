var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var methodOverride = require('method-override');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var session        = require('express-session');

// routes are like controllers in Rails
var index     = require('./routes/index');
var users     = require('./routes/users');
var questions = require('./routes/questions');
var sessions  = require('./routes/sessions');

var app = express();

// Fixes deprecation warning
// We need to tell Mongoose what library to use for Promises
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/awesome_answers_class')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
                  secret: 'keyboard cat',
                  resave: false,
                  saveUninitialized: true,
                  cookie: { secure: true }
                }));
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var passportVerifyCallback = function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }

passport.use(new LocalStrategy({usernameField: 'email'},
                               passportVerifyCallback));


app.use('/', index);
app.use('/users', users);
app.use('/questions', questions);
app.use('/sessions', sessions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
