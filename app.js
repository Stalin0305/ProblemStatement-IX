var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var date=require('date-time');
var dbs;
var MongoClient=require('mongodb').MongoClient;
var ObjectId= require('mongodb').ObjectID;
MongoClient.connect('mongodb://localhost:27017/',{useNewUrlParser:true,urlencoded:true},function(err,db){
  if(err) console.log("Database connection error");
  dbs=db.db('XYZ');
  console.log('Database connected');
});


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/',function(req,res){
  res.redirect('/xyz');
});

app.get('/xyz',function(req,res){
  res.render('index');
});

app.get('/xyz/newProduct',function(req,res){
  res.render('newProduct');
});

app.post('/xyz',function(req,res,next){
  var title=req.body.Prodtitle;
  var image=req.body.Prodimage;
  var body=req.body.Prodbody;
  console.log(image);
  var obj={title: title,image: image,body: body,created: date()};
  console.log(obj);
  dbs.collection('Products').insertOne(obj,function(e,r){
    // if(e) next(e);
    if(e) console.log(e);
    res.redirect('/xyz');
  });
});

app.get('/xyz/update',function(req,res){
  res.render('EditPage');
});


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
