$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 获取文章类别信息
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null;
    // 绑定添加文章类别事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '252px'],
            title: '添加文章类别',
            content: $('#dialog-cate').html()
        });
    })

    $('body').on('submit', '#form-cate', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加类别失败')
                }

                initArtCateList();
                layer.msg('添加类别成功');
                layer.close(indexAdd);
            }
        })
    })

    // 通过代理绑定编辑事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {

        indexEdit = layer.open({
            type: 1,
            area: ['500px', '252px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    })


    // 提交修改请求
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改类别失败');
                }
                layer.msg('修改类别成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })


    // 删除文章分类
    $('tbody').on('click', '.btn-delet', function() {
        var id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除类别失败');
                    }
                    layer.msg('删除类别成功');
                    layer.close(index);
                    initArtCateList();
                }
            })

        })
    })

})