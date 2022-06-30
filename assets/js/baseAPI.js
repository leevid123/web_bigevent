$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    };

    // 全局挂载complate回调
    options.complete = function(res) {
        if (res.responseJSON.status === 1 || res.responseJSON.message === '登录失败!') {
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})