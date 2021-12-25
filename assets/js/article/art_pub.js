$(function() {
    var layer = layui.layer
    var form = layui.form
        // 初始化富文本编辑器
    initEditor()

    initCate()

    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("失败")
                }
                // 调用模板引擎渲染分类下拉菜单
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器 
    var $image = $('#image')
        // 2. 裁剪选项 
    var options = { aspectRatio: 400 / 280, preview: '.img-preview' }
        // 3. 初始化裁剪区域 
    $image.cropper(options)

    // 为选择封面按钮绑定点击事件
    $("#btnChooseImage").on("click", function() {
        $("#coverFile").click()
    })


    // 监听coverFile的change事件
    $("#coverFile").on("change", function(e) {
        // 获取文件列表数组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域 
            .attr('src', newImgURL) // 重新设置图片路径 
            .cropper(options)

    })

    // 文章状态
    var art_state = "已发布"
        // 为草稿按钮绑定点击事件处理函数
    $("#btnSave2").on("click", function() {
            art_state = "草稿"
        })
        //为表单绑定submit时间
    $("#form-pub").on("submit", function(e) {
            e.preventDefault()
                //创建Formdata对象
            var fd = new FormData($(this)[0])
            fd.append("state", art_state)
            $image.cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布 
                width: 400,
                height: 280
            }).toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象 // 得到文件对象后，进行后续的操作
                //将文件对象存到fd中
                fd.append("cover_img", blob)
                    // 发起ajax请求
                publishArticle(fd)

            })
        })
        //发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            //如果向服务器提交的是FormData格式的数据
            //必须添加以下两个配置
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("失败了")
                }
                layer.msg("成了")
                location.href = "/article/art_list.html"
            }
        })
    }
})