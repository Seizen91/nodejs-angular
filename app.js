var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var OptTeacher = require('./model/campus/teacher');
var optTeacher = new OptTeacher();

var app = express();

app.set('port', process.env.PORT || 3000);  //设置端口，可使用process全局变量获取动态端口

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, '/app/views/tpl'));  //配置页面文件（例如.ejs文件）的根目录
//app.set('view engine', 'ejs');
/**
 * 替换文件扩展名ejs为html
 * 第一句是：让ejs能够说识别后缀为‘.html’的文件
 * 第二句：在调用render函数时能自动为我们加上‘.html’后缀，否则我们在用时就得把
 * res.render('user')写成res.render('user.html')，不然会报错
 */
app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));


/**
 * 配置静态文件（例如：.js及.css文件）的根目录
 * 项目启动之后默认会加载当前目录下的index.html文件（自测，因为将名字换一下就不能加载了）
 */
app.use(express.static(path.join(__dirname, 'app')));

//angular启动页（index.html）
app.get('/', function (req, res) {
  /**
   * 两者都可以，前者者偏向于发送一个文件，
   * 后者可以发送JSON字符串等，
   * 另外，使用res.sendFile，接收的参数必须是绝对路径
   */
  //console.log("app.use is used!");
  res.sendFile(path.join(__dirname, 'app/index.html'));
  //res.sendFile('F:/WSCode/nodejsTest/nodejs-angular/app/views/tpl/index.html');
});

//新增数据
app.post('/campus/teacher/addTeacherInfo', function (req, res) {
  var teacherNumber = req.body.teacherNumber;
  var teacherName = req.body.teacherName;
  console.log("----------------");
  console.log("teacherNumber = " + teacherNumber);
  console.log("teacherName = " + teacherName);

  optTeacher.add(teacherNumber, teacherName, function (result) {
    res.send(result);
  });
  console.log("插入数据---------------");
});

//根据工号获取所有数据
app.post('/campus/teacher/getTeacherInfo', function (req, res) {
  var teacherNumber = req.body.teacherNumber;
  console.log("teacherNumber = " + teacherNumber);
  optTeacher.query(teacherNumber, function (result) {
    res.send(result);
  });
  console.log("根据工号查询----------------");
});

//查所有
app.post('/campus/teacher/getTeacherList', function (req, res) {
  optTeacher.queryAll(function (result) {
    console.log(result);
    res.send(result);
  });
  console.log("查询所有----------------");
});

//删除
app.post('/campus/teacher/deleteTeacher', function (req, res) {
  var id = req.body.id;
  optTeacher.delete(id, function (result) {
    res.send(result);
  })
});

//根据id查询信息
app.post('/campus/teacher/getTeacherInfoById', function (req, res) {
  var id = req.body.id;
  optTeacher.getInfoById(id, function (result) {
    res.send(result);
  })
});

//更新数据
app.post('/campus/teacher/updateTeacher', function (req, res) {
  var id = req.body.id;
  var teacherNumber = req.body.teacherNumber;
  var teacherName = req.body.teacherName;
  optTeacher.update(id, teacherNumber, teacherName, function (result) {
    res.send(result);
  })
});
/*
app.post('/campus/teacher/getTeacherList', function (req, res) {

});*/

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
  //res.sendFile('F:/WSCode/nodejsTest/nodejs-angular/app/views/tpl/error.html');
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
