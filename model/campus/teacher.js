/**
 * Created by DELL on 2017/9/28.
 */

//使用连接池
var optPool = require('../OptPool');


function OptTeacher(){
    //插入数据
    this.add = function (teacherNumber, teacherName, handler) {
        var sql = 'insert into teacher(teacherNumber, teacherName) values(?, ?)';
        var param = [teacherNumber, teacherName];
        optPool.execQuery(sql, param, function (result) {
           console.log(result);
           handler(result);
       })
    };

    //根据工号查询数据
    this.query = function (teacherNumber, handler) {
        var sql = 'select * from teacher where teacherNumber like ? ';
        var param = [teacherNumber];
        optPool.execQuery(sql, param, function (result) {
            console.log(result);
            handler(result);
        });
    };

    //查询所有数据
    this.queryAll = function (handler) {
        var sql = 'select * from teacher';
        optPool.execQuery(sql, [], function (result) {
            console.log("11111111111111111111111");
            console.log(result);
            handler(result);
        });
    };

    //更新数据
    this.update = function (id, teacherNumber, teacherName, handler) {
        var sql = 'update teacher set teacherNumber = ?, teacherName = ? where id = ?';
        var param = [teacherNumber, teacherName, id];
        optPool.execQuery(sql, param, function (result) {
            console.log(result);
            handler(result);
        })
    };

    //删除数据
    this.delete = function (id, handler) {
        var sql = 'delete from teacher where id = ?';
        var param = [id];
        optPool.execQuery(sql, param, function (result) {
            console.log(result);
            handler(result);
        })
    };

    //根据id查询信息
    this.getInfoById = function (id, handler) {
        var sql = 'select * from  teacher where id = ?';
        var param = [id];
        optPool.execQuery(sql, param, function (result) {
            console.log(result);
            handler(result);
        })
    }
}

module.exports = OptTeacher;

