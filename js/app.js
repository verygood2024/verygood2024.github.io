(function() {
    if (!('serviceWorker' in navigator)) return;

    const VERSION_KEY = 'hexo_sw_version';
    let refreshing = false;
    let swUpdating = false;
    let swRegistered = false;
    const snackbarQueue = new Set();

    function showSnackbar(text) {
        if (snackbarQueue.has(text)) return;
        snackbarQueue.add(text);
        if (window.btf?.snackbarShow) {
            window.btf.snackbarShow(text);
        } else {
            console.log('[Snackbar]', text);
        }
        setTimeout(() => {
            snackbarQueue.delete(text);
        }, 3000);
    }

    // ===============================
    // HTML失败通知
    // ===============================
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data?.type === 'HTML_CACHE_FALLBACK') {
            showSnackbar('网络异常，正在显示缓存页面，内容可能不是最新');
        }
    });

    // ===============================
    // JS/CSS更新通知
    // ===============================
    const staticChannel = new BroadcastChannel('hexo-static-update');
    staticChannel.onmessage = event => {
        const url = event.data?.payload?.updatedURL;
        if (!url) return;
        if (/\.(js|css)(\?|$)/i.test(url)) {
            showSnackbar('网站资源更新完成，正在刷新');
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    };

    async function getVersionCounter() {
        try {
            const response = await fetch(`/version-counter.json?t=${Date.now()}`, {
                cache: 'no-store'
            });
            if (!response.ok) throw Error();
            return await response.json();
        } catch (e) {
            return null;
        }
    }

    function needSWUpdate(oldV, newV) {
        return (oldV && oldV.major !== newV.major);
    }

    async function checkVersion(registration) {
        const remote = await getVersionCounter();
        if (!remote) return;

        let local;
        try {
            local = JSON.parse(localStorage.getItem(VERSION_KEY));
        } catch {
            local = null;
        }

        if (!local) {
            localStorage.setItem(VERSION_KEY, JSON.stringify(remote));
            return;
        }

        if (needSWUpdate(local, remote)) {
            swUpdating = true;
            showSnackbar('网站大版本更新，正在更新缓存');
            await registration.update();
        }

        localStorage.setItem(VERSION_KEY, JSON.stringify(remote));
    }

    function bindSWUpdate(registration) {
        registration.addEventListener('updatefound', () => {
            const worker = registration.installing;
            if (!worker) return;

            worker.addEventListener('statechange', () => {
                if (
                    worker.state === 'installed' &&
                    navigator.serviceWorker.controller &&
                    swUpdating
                ) {
                    worker.postMessage({ type: 'SKIP_WAITING' });
                }
            });
        });
    }

    async function registerSW() {
        if (swRegistered) return;
        swRegistered = true;

        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                updateViaCache: 'none'
            });
            console.log('[SW注册]', registration.scope);
            bindSWUpdate(registration);
            registration.update();
            await checkVersion(registration);
        } catch (e) {
            console.error('[SW失败]', e);
        }
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing || !swUpdating) return;
        refreshing = true;
        showSnackbar('缓存更新完成，正在刷新');
        setTimeout(() => location.reload(), 800);
    });

    // 延迟注册，避免阻塞首屏
    if (document.readyState === 'complete') {
        setTimeout(registerSW, 500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(registerSW, 500);
        });
    }
})();