var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

//全局拦截器，非指定接口需要登录后才能请求
app.use(function (req, res, next) {
  console.log(req.path);
  if (req.cookies.uid) {
    next()
  } else {
    // req.path.indexOf("admin")!=-1
    if (req.originalUrl == '/users/userLogin' || req.originalUrl == '/users/logout' || req.path == '/users/register' || req.path=="/users/change_user_msg" || req.path=='/users/add_shop_recom') {
      next()
    } else {
      res.json({
        code: 10000,
        msg: '当前未登录！',
        result: ''
      })
    }
  }
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
