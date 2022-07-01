$(function() {
    var layer = layui.layer;

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
    // 调用页面数据方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
            }
        })
    }
})