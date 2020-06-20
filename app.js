var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var date=require('date-time');
var shortid=require('shortid');
// import alert from 'alert';
// var popups=require('popups');
var popup=require('node-popup');
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
  var obj={title: title,image: image,body: body,updated_on: date()};
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


app.post('/xyz/update',function(req,res){
  var id=req.body.IDproduct;
  console.log(id);
  dbs.collection('Products').findOne({ _id: ObjectId(id) }, function (e, r) {
    if (e) console.log(e);
    if (r == null) { res.render('editForm',{error :"yes"}) };
    console.log(r);
    res.render("editForm", { product: r,error :"null" });
  });
});

// app.get('/xyz/edit/:id',function(req,res){
//   var id=req.params.id;
//   console.log(id);
//   dbs.collection('Products').findOne({_id: ObjectId(id)},function(e,r){
//     if(e) console.log(e);
//     if(r==null) 
//     { console.log("Invalid id");}
//     res.render("editForm",{product:r});

//   });

app.post('/xyz/edit', function (req, res,next) {
  console.log("sgsgdgsg");
  var id = req.body.Idprod;
  var obj={ $set: {title: req.body.Prodtitle, image: req.body.Prodimage, body: req.body.Prodbody, updated_on: date()}};
  dbs.collection('Products').updateOne({_id: ObjectId(id)},obj,function(e,r){
    if(e) next(e);
    console.log("Updated");
    res.redirect("/xyz");
  })
  console.log(id);
  res.end;
});

app.get('/xyz/show',function(req,res){
  dbs.collection('Products').find().toArray(function(e,r){
    if(e) next(e);
    if(r==null){
      console.log("Empty");
    }
    res.render('ShowProducts',{product:r});
  })
});

app.get('/xyz/delete',function(req,res){
  res.render('deletePage')
});

app.post('/xyz/remove',function(req,res){
  var id = req.body.IDproduct;
  console.log(id);
  res.end;
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
