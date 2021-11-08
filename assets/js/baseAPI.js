// 每次调用$.get() 或$.post()会先调用这个函数
$.ajaxPrefilter(function(options) {
    console.log(options.url);
    options.url = "http://api-breakingnews-web.itheima.net" + options.url

    // 同意为有权限的接口设置headers
    if (options.url.indexOf("/my") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }

    // 全局同意挂载complete回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message == "身份认证失败！") {
            // 1强制清空token
            localStorage.removeItem("token")
                // 2强制跳转登录页
            location.href = "/login.html"
        }
    }
})