(function () {
    function hasRefreshed() {
        return location.search.includes('aplayer_refreshed=1');
    }

    function addRefreshFlagAndReload() {
        const url = new URL(window.location.href);
        url.searchParams.set('aplayer_refreshed', '1');
        window.location.replace(url.toString()); // 替换当前 URL，避免堆积历史记录
    }

    function checkAndRefresh() {
        const aplayerElements = document.querySelectorAll('.aplayer');
        if (aplayerElements.length > 0 && !hasRefreshed()) {
            addRefreshFlagAndReload();
        }
    }

    function showSnackbarAndCleanURL() {
        if (hasRefreshed()) {
            // 延迟 300ms 显示提示
            setTimeout(() => {
                btf.snackbarShow('已自动加载音乐生成器完成');
            }, 300);

            // 清除 URL 参数（不刷新页面，只替换历史记录）
            const url = new URL(window.location.href);
            url.searchParams.delete('aplayer_refreshed');
            window.history.replaceState(null, '', url.toString());
        }
    }

    // 各类加载场景都处理
    document.addEventListener('DOMContentLoaded', function () {
        checkAndRefresh();
        showSnackbarAndCleanURL();
    });

    document.addEventListener('pjax:success', function () {
        checkAndRefresh();
        showSnackbarAndCleanURL();
    });

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            checkAndRefresh();
            showSnackbarAndCleanURL();
        }
    });
})();
