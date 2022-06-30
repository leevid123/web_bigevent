$(function() {
    getUserInfo();

    var layer = layui.layer;
    // 退出功能
    $('#btnlogOut').on('click', function() {
        layer.confirm('确定是否退出?', { icon: 3, title: '提示' }, function(index) {
            //1、移除本地存储token
            localStorage.removeItem('token');
            // 2、跳转登录页
            location.href = '/login.html'
            layer.close(index);
        });
    })
})

// 获取用户信息方法
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            renderAvatar(res.data);
        },
        // complete: function(res) {
        //     // console.log('执行了complete回调');
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
        //         localStorage.removeItem('token');
        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 渲染用户头像方法
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }

}