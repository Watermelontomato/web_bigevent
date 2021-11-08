$(function() {
    getUserInfo()
    $("#btnLogout").on("click", function() {
        console.log("ok");
        // 提示用户是否确认
        var layer = layui.layer
        layer.confirm('is not?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // console.log("yes");
            // 1清空本地存储的token
            localStorage.removeItem("token")
                // 2跳转登录页
            location.href = "/login.html"
                // 关闭confirm评论框
            layer.close(index);
        });
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取失败")
            }
            // 渲染用户头像
            renderAvatar(res.data)
        },
        // complete: function(res) {
        //     // console.log("执行complete");
        //     // console.log(res);
        //     // res.responseJSON拿到 服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message == "身份认证失败！")
        //     // 1强制清空token
        //         localStorage.removeItem("token")
        //         // 2强制跳转登录页
        //     location.href = "/login.html"

        // }
    })
}

function renderAvatar(user) {
    // 1. 获取用户名称
    var name = user.nockname || user.username
        // 设置欢迎文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
        // 按需渲染
    if (user.user_pic != null) {
        //渲染图片
        $(".layui-nav-img").html().attr("src", user.user_pic).show()
        $(".text-avatar").hide()
    } else {
        //渲染文本
        $(".layui-nav-img").hide()
            //获取字符串第一个字符
        var first = name[0].toUpperCase()
        $(".text-avatar").html(first).show
    }
}