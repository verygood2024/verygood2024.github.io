(function () {
    if (!('serviceWorker' in navigator)) return;

    const VERSION_KEY = 'hexo_cache_version';
    let refreshing = false;

    function showSnackbar(text) {
        if (window.btf?.snackbarShow) {
            window.btf.snackbarShow(text);
        } else {
            console.log('[Snackbar]', text);
        }
    }

    async function getRemoteVersion() {
        try {
            const response = await fetch(`/cache-version-prod.json?t=${Date.now()}`, {
                cache: 'no-store'
            });
            if (!response.ok) return null;
            const data = await response.json();
            return data.version;
        } catch(e) {
            return null;
        }
    }

    async function checkVersion(registration) {
        const remote = await getRemoteVersion();
        if (!remote) return;

        const local = localStorage.getItem(VERSION_KEY);
        if (remote === local) {
            return;
        }

        showSnackbar('发现网站更新，正在检查资源...');
        localStorage.setItem(VERSION_KEY, remote);

        await registration.update();
    }

    async function registerSW() {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                updateViaCache: 'none'
            });

            console.log('[SW] 注册成功');

            // 立即检查
            await registration.update();

            // 定期检查
            setInterval(() => {
                registration.update();
            }, 5 * 60 * 1000);

            registration.addEventListener('updatefound', () => {
                const worker = registration.installing;
                if (!worker) return;

                worker.addEventListener('statechange', () => {
                    if (worker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            showSnackbar('网站资源更新完成，正在刷新...');
                        } else {
                            showSnackbar('网站已支持离线访问');
                        }
                    }
                });
            });

            await checkVersion(registration);
        } catch(e) {
            console.error('[SW]', e);
        }
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        location.reload();
    });

    window.addEventListener('load', registerSW);
})();