/**
 * Created by DELL on 2017/9/28.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//该路由使用的中间件
router.use(function timeLog(req, res, next) {
    console.log("Time:" + new Date());
    next();
});

//定义网站主页的路由
router.get('/', function (req, res) {
    res.send("Birds home page");
});

//定义about页面的路由
router.post('/about', function (req, res) {
    res.send("About birds");
});

module.exports = router;