(function () {
    if (!('serviceWorker' in navigator)) return;

    const VERSION_KEY = 'hexo_cache_version';
    const STATUS_KEY = 'hexo_sw_status';

    let refreshing = false;
    let registered = false;
    let updating = false;
    let currentVersion = null;
    let updateTimer = null;

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
            } catch(e) {
                console.warn(`[SW]版本获取失败 ${retry}`);
                await new Promise(r => setTimeout(r, Math.min(retry * 500, 5000)));
            }
        }
    }

    async function checkVersion(registration) {
        if (updating) return;

        const remote = await getRemoteVersion();
        const local = localStorage.getItem(VERSION_KEY);
        const controller = navigator.serviceWorker.controller;

        // 第一次安装
        if (!controller) {
            console.log('[SW]首次安装');
            return;
        }

        // 已经是最新
        if (remote === local) {
            console.log('[SW]版本一致:', remote);
            return;
        }

        updating = true;
        localStorage.setItem(STATUS_KEY, 'updating');
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
                if (worker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        showSnackbar('关键资源更新完成，正在应用...');
                        worker.postMessage({
                            type: 'SKIP_WAITING'
                        });
                    }
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

            // 检查版本
            await checkVersion(registration);

            // 定期检查
            if (!updateTimer) {
                updateTimer = setInterval(() => {
                    checkVersion(registration);
                }, 1 * 60 * 1000);
            }
        } catch(e) {
            console.error('[SW注册失败]', e);
            registered = false;
        }
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;

        if (currentVersion) {
            localStorage.setItem(VERSION_KEY, currentVersion);
            localStorage.setItem(STATUS_KEY, 'installed');
        }

        showSnackbar('网站更新完成，正在刷新...');
        setTimeout(() => {
            location.reload();
        }, 1200);
    });

    // 页面加载
    window.addEventListener('load', registerSW);

    // PJAX
    document.addEventListener('pjax:complete', () => {
        registerSW();
    });
})();