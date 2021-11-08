$(function() {
    // #点击注册账号
    $("#link_reg").on("click", function() {
            $(".login-box").hide()
            $(".reg-box").show()
        })
        // 点击登录
    $("#link_login").on("click", function() {
        $(".login-box").show()
        $(".reg-box").hide()
    })

    // 从layui从获取去form对象
    var form = layui.form
    var layer = layui.layer
    form.verify({
            // 自定义pwd的规则
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 校验2次密码是否一致
            repwd: function(value) {
                var pwd = $(".reg-box [name=password]").val()
                if (pwd !== value) {
                    return "两次密码不一致"
                }
            }

        })
        // 监听注册表单
    $("#form_reg").on("submit", function(e) {
        e.preventDefault()
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }
        $.post("/api/reguser", data, function(res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message)
            }
            layer.msg("注册成功，可以登陆!")

            $("#link_login").click()
        })

    })

    // 监听登陆表单的提交
    $("#form_login").submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: "/api/login",
            method: "POST",
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("登陆失败")
                }
                layer.msg("登陆成功")
                    // 将登陆成功的token保存在localStorage中
                localStorage.setItem("token", res.token)
                console.log(res.token);
                // 跳转后台主页
                location.href = "/index.html"

            }
        })
    })



})