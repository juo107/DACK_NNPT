require('dotenv').config({ path: require('path').join(__dirname, '.env') });
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
let mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// CORS: dev cho localhost/127.0.0.1 mọi cổng (Vite đổi port hoặc mở bằng 127.0.0.1).
// Production: đặt FRONTEND_ORIGIN (một origin cụ thể).
app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV === 'production') {
      const allowed = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
      return callback(null, origin === allowed ? origin : false);
    }
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, origin);
    }
    callback(null, false);
  },
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/carts', require('./routes/carts'));
app.use('/api/v1/upload', require('./routes/upload'));
app.use('/api/v1/messages', require('./routes/messages'));
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/NNPTUD-C3';
mongoose.connect(MONGO_URI);
// Đăng ký model để Mongoose tạo index / dùng được collection wishlists, wishlistitems
require('./schemas/wishlists');
require('./schemas/wishlistItems');
mongoose.connection.on('connected',()=>{
  console.log("connected");
})
mongoose.connection.on('disconnected',()=>{
  console.log("disconnected");
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
