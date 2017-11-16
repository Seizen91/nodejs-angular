/**
 * Created by DELL on 2017/9/28.
 */

/**
 * 使用mysql数据库
 * 使用连接池连接数据库，效率比直接连接高效
 */
var db = {};
var mysql  = require('mysql');
var config = require('./config.json');

var options = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
    port: config.port,
    connectionLimit: config.maxConnLimit,
    supportBigNumbers: true,
    bigNumberStrings: true
};

var pool = mysql.createPool(options);

db.execQuery = function (sql, param, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            console.log("connection error: " + err);
            return;
        }
        console.log("connection succeed!");

        conn.query(sql, param, function (err, result) {
            if (err) {
                console.log("query error: " + err);
                return;
            }
            callback(result);
            console.log("query succeed!");
            conn.release(); //放回连接池
        })
    })
};

module.exports = db;
