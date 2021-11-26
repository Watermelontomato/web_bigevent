$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度必须在一到六字符之间"
            }
        }
    })


    initUserInfo()

    //初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取信息失败")
                }
                console.log(res);
                // 调用form.val()快速赋值
                form.val("formUserInfo", res.data)
            }
        })
    }

    //重置按钮
    $("#btnReset").on("click", function(e) {
            //阻止默认的重置
            e.preventDefault()
                //再次调用初始化函数
            initUserInfo()
        })
        //监听表单提交

    $(".layui-form").on("submit", function(e) {
        //阻止表单默认提交
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新失败")
                }
                layer.msg("更新成功")
                    //调用父页面，渲染用户信息
                window.parent.getUserInfo()
            }



        })
    })

})