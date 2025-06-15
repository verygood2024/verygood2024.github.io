(function () {
    const html = document.documentElement;

    // 从 localStorage 获取版本
    let version = localStorage.getItem('site_version');

    // 如果没有存储，默认设置为 new（你可以替换为其他条件逻辑）
    if (!version) {
    version = 'new'; // or 'old'
    localStorage.setItem('site_version', version);
    }

    // 设置到 <html> 元素上
    html.setAttribute('data-version', version);

    // 切换函数暴露为全局（用于按钮点击）
    window.toggleVersion = function () {
    const current = localStorage.getItem('site_version');
    const newVersion = current === 'new' ? 'old' : 'new';
    localStorage.setItem('site_version', newVersion);
    html.setAttribute('data-version', newVersion);
    };
})();