$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDay());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '' + hh + '-' + mm + '-' + ss;
    }

    // 定义补零函数
    function padZero(n) {
        n > 9 ? n : '0' + n;
    }

    // 查询参数
    var q = {
        pagenum: 1, //页码
        pagesize: 2, //每页显示多少数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态
    };
    initTable();
    initCate();
    // 调用页面数据方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    // 获取文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                // 调用模版引擎
                var htmlStr = template('tpl-cate', res)
                $('[name="cate_id"]').html(htmlStr);
                // 通知layui重新渲染表单区
                form.render();
            }
        })
    }

    // 为筛选绑定事件
    $('#art-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        q.cate_id = cate_id;
        q.state = state;
        // 调用列表渲染
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器
            count: total, //分页总数
            limit: q.pagesize, //每页显示数目
            curr: q.pagenum, //默认选中
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生变化的时候使用jump回调
            //1、点击页码触发
            //2、调用了laypage.render触发
            jump: function(obj, first) {
                    //最新的页码值赋值
                    q.pagenum = obj.curr;
                    //最新的条目赋值
                    q.pagesize = obj.limit;
                    if (!first) {
                        initTable()
                    }
                }
                //可以通过first的值来判断是哪种方式触发

        })

    }

    //绑定删除事件
    $('tbody').on('submit', '.btn-delete', function() {
        //判断页面中删除按钮(剩余数据)
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功');
                    layer.close(index);

                    // 判断页面中的剩余数据
                    if (len === 1) {
                        // 页面中只有一条数据了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
        });
    })
})