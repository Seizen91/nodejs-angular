/**
 * Created by DELL on 2017/9/28.
 */

app.controller('TeacherCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {

    //页面一进来就加载表格数据
    var url="/campus/teacher/getTeacherList";
    $http({
        method: "post",
        url: url
    }).success(function (data, status) {
        createTeacherTb(data);
        console.log(data);
    }).error(function (data, status) {

    });

    $scope.queryTeacher = function () {
        $.ajax({
            url:"/campus/teacher/getTeacherInfo",
            type: 'POST',
            data: {
                teacherNumber: $scope.teacherNumber,
                //teacherName: $scope.teacherName
            },
            dataType: 'JSON',
            error: function(err){
                layer.alert('链接访问失败！');
            },
            success: function(result){
                console.log("3333333333333333333333333");
                console.log(result);
                createTeacherTb(result);
            }
        });
    };
    
    function getTeacherList() {
        $.ajax({
            url:"/campus/teacher/getTeacherList",
            type: 'POST',
            dataType: 'JSON',
            error: function(err){
                console.log('链接访问失败！');
                console.log(err);
                //layer.alert('链接访问失败！');
            },
            success: function(result){
                console.log("3333333333333333333333333");
                console.log(result);
                createTeacherTb(result);
            }
        });
    }

    //表格创建
    var oTbl;
    function  createTeacherTb(data) {
        $('#teacherTb').dataTable().fnDestroy();
        oTbl = $('#teacherTb').dataTable( {
            "bProcessing": true, //DataTables载入数据时，是否显示‘进度’提示
            "bAutoWidth": false,
            "bSort": false,
            "bStateSave":true,
            "searching": false,
            "data": data,
            "aoColumns": [
                {"mData": function (data, par1, par2, settings) {
                    var obj = {
                        "teacherId":data.id
                    };
                    var s = '<label class="i-checks m-b-none"><input type="checkbox" name="chk" value="' + $.param(obj) + '"/><i></i></label>';
                    return s;
                }},
                /* { "data": "teacherSid" },*/
                { "data": "teacherNumber" },
                { "data": "teacherName" },
              /*  { "data": "teacherEducation" },
                { "data": "className" },
                { "data": "dateTime" },*/
                {"mData":function (data, par1, par2, settings) {

                    var option = '<button class="btn btn-primary btn-addon xw100" name="modifyOne" data="'+data.id+'">修改</button>';

                    return '<button class="btn btn-danger btn-addon xw100" name="deleteOne" data="'+data.id+'">删除</button><span>&nbsp;&nbsp;</span>'+option;

                }}
            ],
            "iDisplayLength":10,
            "oLanguage": {
                "goBtn":{flag: true, callback: function (btnId, iptId, total, start, len) {
                    var jumpPage = $("#" + iptId).val();
                    var numReg = /^\+?[1-9][0-9]*$/;
                    if(!numReg.test(jumpPage)){
                        jumpPage = 1;
                        $("#" + iptId).val(jumpPage);
                    }
                    var totalPages = 0;
                    if(0 == total % len){
                        totalPages = Math.floor(total / len);
                    }else {
                        totalPages = Math.floor(total / len) +1;
                    }
                    if(parseInt(jumpPage) > totalPages){
                        jumpPage = totalPages;
                        $("#" + iptId).val(jumpPage);
                    }
                    oTbl.fnPageChange(parseInt(jumpPage)-1);
                }},
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sSearch": "快速查找：",
                "sZeroRecords": "没有检索到数据",
                "sProcessing": "正在加载数据中...",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
            },
            fnInitComplete: function () {
                $("#teacherTb tr:eq(0) th:eq(0)").removeClass('sorting_asc')

                $("#chkAll").on("click", function (evt) {
                    evt.stopPropagation();
                    var chkNum = $("input[type='checkbox'][name='chk']", $('#teacherTb')).length;
                    var checkedNum = $("input[type='checkbox'][name='chk']:checked", $('#teacherTb')).length;
                    if(chkNum == checkedNum){
                        $("input[type='checkbox'][name='chk']", $('#teacherTb')).prop("checked", false);
                        $('#chkAll').prop("checked", false);
                    }else {
                        $("input[type='checkbox'][name='chk']", $('#teacherTb')).prop("checked", true);
                        $('#chkAll').prop("checked", true);
                    }
                });
                $("input[type='checkbox'][name='chk']").on("click", function (evt) {
                    evt.stopPropagation();
                    var chkNum = $("input[type='checkbox'][name='chk']", $('#teacherTb')).length;
                    var checkedNum = $("input[type='checkbox'][name='chk']:checked", $('#teacherTb')).length;
                    if(chkNum == checkedNum){
                        $('#chkAll').prop("checked", true);
                    }else {
                        $('#chkAll').prop("checked", false);
                    }
                });
            },
        } );
    }

    //点击删除按钮删除某条数据
    $("#teacherTb tbody").on("click", "button[name='deleteOne']", function (evt) {
        var teacherSid = $(evt.target).attr("data");
        console.log("teacherSid="+teacherSid);
        layer.confirm('确认删除这条信息吗？', {
            btn: ['确认','取消'], //按钮
            shade: false //不显示遮罩
        }, function(index){
            // 提交表单的代码，需要你自己写，然后用 layer.close 关闭就可以了，取消可以省略
            $.ajax({
                url:"/campus/teacher/deleteTeacher",
                type: 'POST',
                data: {
                    id: teacherSid
                },
                dataType: 'JSON',
                error: function(){
                    layer.alert('链接访问失败！');
                },
                success: function(result){
                    console.log("111111111111111111");
                    console.log(result);
                    getTeacherList();
                    layer.alert('删除成功！');
                }
            });
            layer.close(index);
        });
    });

    var flag; //判断是新增还是修改
    $scope.submitData = function () {
        //"0"代表新增, "1"代表修改
        if(flag == 0){
            confirmAdd();
        }
        if(flag == 1){
            confirmModify();
        }
    };

    $scope.cancelData = function () {
        //"0"代表新增, "1"代表修改
        if(flag == 0){
            cancelAdd();
        }
        if(flag == 1){
            cancelModify();
        }
    };

    //新增页面
    var tempAdd;
    $scope.addTeacher = function () {
        $("#tNumber1").val("");
        $("#tName1").val("");
        tempAdd = layer.open({
            type: 1,
            // skin: 'layui-layer-rim', //加上边框
            title: '新增信息',
            area: ['400px', '250px'],
            content: $("#addContent")
        });
        flag = 0;
    };

    //点击新增里的取消按钮
    function cancelAdd () {
        layer.close(tempAdd);
    }

    //点击新增里的确认按钮
    function confirmAdd() {
        $.ajax({
            url:"/campus/teacher/addTeacherInfo",
            type: 'POST',
            data: {
                teacherNumber: $("#tNumber1").val(),
                teacherName: $("#tName1").val()
            },
            dataType: 'JSON',
            error: function(err){
                //console.log('链接访问失败！');
                console.log(err);
                //layer.alert('链接访问失败！');
            },
            success: function(result){
                console.log(result);
                getTeacherList();
                layer.close(tempAdd);
                layer.alert('新增成功！');
            }
        });
    }

    var tempModify;
    var modifyId;
    //点击修改按钮弹出修改页面
    $("#teacherTb tbody").on("click", "button[name='modifyOne']", function (evt) {
        var teacherSid = $(evt.target).attr("data");
        $.ajax({
            url:"/campus/teacher/getTeacherInfoById",
            type: 'POST',
            data: {
                id: teacherSid
            },
            dataType: 'JSON',
            error: function(){
                layer.alert('链接访问失败！');
            },
            success: function(result){
                console.log(result);
                console.log(result[0].teacherNumber); //返回来的是哥json数组
                $("#tNumber1").val(result[0].teacherNumber);
                //document.getElementById("tNumber1").disabled=true;
                $("#tName1").val(result[0].teacherName);
                //document.getElementById("tName1").disabled=true;
                tempModify = layer.open({
                    type: 1,
                    //skin: 'layui-layer-rim', //加上边框
                    title: '修改信息',
                    area: ['400px', '250px'],
                    content: $("#addContent")
                });
                flag = 1;
                modifyId = teacherSid;
            }
        });
    });

    //点击修改页面的取消按钮
    function cancelModify (){
        layer.close(tempModify);
    }

    //点击修改页面的提交按钮
    function confirmModify (){
        var tNumber = $("#tNumber1").val();
        var tName = $("#tName1").val();
        layer.confirm('确认修改这条记录吗？', {
            btn: ['确认','取消'], //按钮
            shade: false //不显示遮罩
        }, function(index){
            // 提交表单的代码，需要你自己写，然后用 layer.close 关闭就可以了，取消可以省略
            $.ajax({
                url:"/campus/teacher/updateTeacher",
                type: 'POST',
                data: {
                    id: modifyId,
                    teacherNumber: tNumber,
                    teacherName: tName
                },
                dataType: 'JSON',
                error: function(){
                    layer.alert('链接访问失败！');
                },
                success: function(result){
                    getTeacherList();
                    layer.close(tempModify);
                    layer.alert('修改成功！');

                }
            });
            layer.close(index);
        });
    }


}]);

