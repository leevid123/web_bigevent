$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败');
                }
                // 调用模版引擎
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);
                form.render();
            }
        })
    }

    // 裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click();
        })
        // 定义发布状态
    var art_state = '已发布';
    $('btnSave2').on('click', function() {
        art_state = '草稿';
    })

    //为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        //创建 formdata对象
        var fd = new FormData($('#form-pub')[0]);
        //追加状态
        fd.append('state', art_state);
        // 将裁剪的图片输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                //将输出文件追加到 fd 中
                fd.append('cover_img', blob);
                publishArt(fd);
            })


    })

    // 发起表单提交请求
    function publishArt(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '/article/art_list.html';
            }

        })
    }
})