$(function() {
    var layer = layui.layer
    var $image = $('#image')
    const options = {

        aspectRatio: 1,

        preview: '.img-preview'
    }

    $image.cropper(options)
        // 为上传按钮绑定点击事件
    $("#btnChooseImage").on("click", function() {
            $("#file").click()
        })
        // 为文件选择框绑定change事件
    $("#file").on("change", function(e) {
            // console.log(e);
            var filelist = e.target.files
                // console.log(filelist);
            if (filelist.length === 0) {
                return layer.msg("选照片")
            }
            // 拿到用户选择的文件夹
            var file = e.target.files[0]
                // 将文件转换为路径
            var imgURL = URL.createObjectURL(file)
                // 重新初始化裁剪区
            $image 
                .cropper('destroy')   
                .attr('src', imgURL) 
                .cropper(options)
        })
        // 为确定按钮绑定点击事件
    $("#btnUpload").on("click", function() {
        var dataURL = $image  
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布        
                width: 100,
                    
                height: 100  
            })  
            .toDataURL('image/png') 
            // 调用接口上传图片到服务器
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更换头像失败")
                }
                layer.msg("更换成功")
                window.parent.getUserInfo()
            }
        })

    })

})