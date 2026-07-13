(function () {
    if (!('serviceWorker' in navigator)) return;

    const VERSION_KEY = 'hexo_cache_version';
    const STATUS_KEY = 'hexo_sw_status';

    let registered = false;
    let refreshing = false;
    let updating = false;
    let currentVersion = null;

    function showSnackbar(text) {
        if (window.btf?.snackbarShow) {
            window.btf.snackbarShow(text);
        } else {
            console.log('[Snackbar]', text);
        }
    }

    async function getRemoteVersion() {
        let retry = 0;
        while (true) {
            retry++;
            try {
                const response = await fetch(`/cache-version-prod.json?t=${Date.now()}`, {
                    cache: 'no-store'
                });
                if (!response.ok) {
                    throw new Error(response.status);
                }
                const data = await response.json();
                if (!data.version) {
                    throw new Error('版本为空');
                }
                currentVersion = data.version;
                return data.version;
            } catch (e) {
                console.warn(`[SW]版本获取失败(${retry})`);
                await new Promise(resolve =>
                    setTimeout(resolve, Math.min(retry * 500, 5000))
                );
            }
        }
    }

    async function checkVersion(registration) {
        if (updating) return;

        const remote = await getRemoteVersion();
        const local = localStorage.getItem(VERSION_KEY);
        const controller = navigator.serviceWorker.controller;

        // 没有SW
        // 可能: 1.第一次访问 2.用户清除了SW
        if (!controller) {
            if (!local) {
                showSnackbar('正在初始化离线缓存...');
            }
            return;
        }

        // 版本一致
        if (remote === local) {
            console.log('[SW]版本一致', remote);
            return;
        }

        updating = true;
        sessionStorage.setItem(STATUS_KEY, 'updating');
        showSnackbar('发现网站更新，正在后台下载关键资源...');
        await registration.update();
    }

    function watchUpdate(registration) {
        registration.addEventListener('updatefound', () => {
            if (!updating) return;

            const worker = registration.installing;
            if (!worker) return;

            worker.addEventListener('statechange', () => {
                console.log('[SW]', worker.state);
                if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                    showSnackbar('关键资源更新完成，正在应用...');
                    worker.postMessage({
                        type: 'SKIP_WAITING'
                    });
                }
            });
        });
    }

    async function registerSW() {
        if (registered) return;
        registered = true;

        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                updateViaCache: 'none'
            });

            console.log('[SW]注册成功');
            watchUpdate(registration);
            await checkVersion(registration);

            setInterval(() => {
                checkVersion(registration);
            }, 1 * 60 * 1000);
        } catch(e) {
            registered = false;
            console.error('[SW]注册失败', e);
        }
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing || !updating) {
            return;
        }
        refreshing = true;

        if (currentVersion) {
            localStorage.setItem(VERSION_KEY, currentVersion);
        }
        sessionStorage.removeItem(STATUS_KEY);

        showSnackbar('网站更新完成，正在刷新...');
        setTimeout(() => {
            location.reload();
        }, 1000);
    });

    window.addEventListener('load', registerSW);
    document.addEventListener('pjax:complete', registerSW);
})();