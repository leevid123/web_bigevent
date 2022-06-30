$(function() {
    $('#registerBtn').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#loginBtn').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    //为表单添加验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //注册密码和输入密码值要一样
        repwd: function(value) {
            pwd = $('.reg-box [name=password] ').val();
            if (value !== pwd) {
                return '两次密码不一致！'
            }
        }
    });

    // 调用接口发起注册用户请求
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username] ').val(),
            password: $('#form_reg [name=password] ').val()
        };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功！');
            $('#loginBtn').click();
        })
    })

    //监听表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功')
                localStorage.setItem('token', res.token);
                location.href = "/index.html";
            }
        })
    })
})