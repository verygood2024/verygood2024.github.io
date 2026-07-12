(function () {
    if (!('serviceWorker' in navigator)) return;
    const VERSION_KEY = 'hexo_cache_version';
    let refreshing = false;
    function showSnackbar(text) {
        if (window.btf?.snackbarShow) {
            window.btf.snackbarShow(text);
            return;
        }
        console.log('[Snackbar]', text);
    }
    async function getRemoteVersion() {
        try {
            const response = await fetch(`/cache-version-prod.json?t=${Date.now()}`,{ cache:'no-store' });
            if (!response.ok) return null;
            const data = await response.json();
            return data.version;
        } catch(e) {
            return null;
        }
    }
    async function checkVersion() {
        const remote = await getRemoteVersion();
        if (!remote) return;
        const local = localStorage.getItem(ERSION_KEY);
        if (remote === local) return;
        showSnackbar('发现网站更新，正在后台更新资源...');
        localStorage.setItem(VERSION_KEY, remote);
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
    }
    async function registerSW() {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', { updateViaCache: 'none' });
            console.log('[SW] 注册成功');
            registration.onupdatefound = () => {
                const worker = registration.installing;
                if (!worker) return;
                worker.addEventListener('statechange', () => {
                    if (worker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            showSnackbar('网站资源更新完成，正在刷新...');
                            worker.postMessage({ type: 'SKIP_WAITING' });
                        } else {
                            showSnackbar('网站已缓存，可离线访问');
                        }
                    }
                });
            };
        } catch(e) {
            console.error('[SW] 注册失败', e);
        }
    }
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        location.reload();
    });
    window.addEventListener('load', async () => {
        await registerSW();
        await checkVersion();
    });
})();