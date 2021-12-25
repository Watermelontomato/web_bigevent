$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date()
        var y = dt.getFullYear()
        var m = dt.getMonth() + 1
        var d = dt.getDate()
        var hh = dt.getHours()
        var mm = dt.getMinutes()
        var ss = dt.getSeconds()
        return y + "年" + m + "月" + d + "日" + hh + "时" + mm + "分" + ss + "秒"
    }

    function padZero(n) {
        return n > 9 ? n : "0" + n
    }



    var q = {
        pagenum: 1, //拿取第一页的数据
        pagesize: 2, //每页显示2条数据
        cate_id: "",
        state: "",
    }

    initTable()
    initCate()
        // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败")
                }
                // 模板引擎
                // layer.msg()
                var htmlStr = template("tpl-table", res)
                console.log(htmlStr);
                $("tbody").html(htmlStr)
                    // diaoyong分页方法
                renderPage(res.total)
            }


        })
    }
    // 初始化文章分类

    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败")
                }
                // 调用模板引擎渲染分类的可选项目
                var htmlStr = template("tpl-cate", res)
                    // console.log(htmlStr);
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }

    // 筛选

    $("#form-search").on("submit", function(e) {
        e.preventDefault()
        var cate_id = $("[name=cate_id]").val()
        var state = $("[name=state]").val()
            // 为q属性赋值
        q.cate_id = cate_id
        q.state = state
            // 重新渲染表格数据
        initTable()
    })

    //分页
    function renderPage(total) {
        laypage.render({
            elem: "pageBox",
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ["count", "limit", "prev", "page", "next",
                "skip"
            ],
            limits: [2, 3, 5, 10],
            junmp: function(obj, first) {
                // 把最新页码值赋值到q中的pagenum中去
                q.pagenum = obj.curr
                    // 把最新的条目数赋值到q
                q.pagesize = obj.limits
                    //防止死循环
                if (!first) {
                    initTable()
                }
            }
        })
    }
    //为删除按钮绑定事件
    $("tbody").on("click", ".btn-delete", function() {
        var len = $(".btn-delete").length
        var id = $(this).attr("data-id")
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            //do something  
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg("删除失败")
                    }
                    layer.msg("chenggong")
                    if (len === 1) {
                        // 如果len=1页面无任何数据页码最小必须为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})