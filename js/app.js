(function () {
    if (!('serviceWorker' in navigator)) return;

    const VERSION_KEY = 'hexo_cache_version';
    const MANUAL_CLEAR_KEY = 'hexo_manual_clear';

    let refreshing = false;
    let updating = false;
    let snackbarQueue = new Set();
    let currentRegistration = null;
    let remoteVersion = null;

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

    async function getRemoteVersion() {
        let retry = 0;
        while (true) {
            retry++;
            try {
                const response = await fetch(`/cache-version-prod.json?t=${Date.now()}`, {
                    cache: 'no-store'
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                if (!data.version) {
                    throw new Error('version missing');
                }
                return data.version;
            } catch (error) {
                console.warn(`[SW]版本获取失败，第${retry}次重试`, error);
                // 第一次立即重试，后续逐渐增加间隔
                await new Promise(resolve => {
                    setTimeout(resolve, Math.min(retry * 1000, 10000));
                });
            }
        }
    }

    async function checkVersion(registration) {
        remoteVersion = await getRemoteVersion();

        const localVersion = localStorage.getItem(VERSION_KEY);
        const manualClear = localStorage.getItem(MANUAL_CLEAR_KEY);

        console.log('[版本检查]', {
            remoteVersion,
            localVersion,
            manualClear
        });

        // 用户主动清缓存
        if (manualClear) {
            showSnackbar('缓存已重置，正在重新初始化...');
            localStorage.removeItem(MANUAL_CLEAR_KEY);
            updating = true;
            await registration.update();
            return;
        }

        // 首次访问，不提示网站更新，只是初始化版本记录
        if (!localVersion) {
            localStorage.setItem(VERSION_KEY, remoteVersion);
            console.log('[SW]首次访问记录版本');
            return;
        }

        // 版本一致
        if (localVersion === remoteVersion) {
            console.log('[SW]版本一致，无需更新');
            return;
        }

        // 网站更新
        updating = true;
        showSnackbar('发现网站更新，正在后台下载关键资源...');
        await registration.update();
    }

    function bindUpdateListener(registration) {
        registration.addEventListener('updatefound', () => {
            const worker = registration.installing;
            if (!worker) return;

            worker.addEventListener('statechange', () => {
                console.log('[SW状态]', worker.state);

                // 新SW安装完成
                if (worker.state === 'installed') {
                    // 第一次安装
                    if (!navigator.serviceWorker.controller) {
                        localStorage.setItem(VERSION_KEY, remoteVersion);
                        showSnackbar('离线缓存初始化完成');
                        return;
                    }

                    // 更新完成
                    if (updating) {
                        localStorage.setItem(VERSION_KEY, remoteVersion);
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
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                updateViaCache: 'none'
            });

            currentRegistration = registration;
            console.log('[SW]注册成功', registration.scope);
            bindUpdateListener(registration);
            await checkVersion(registration);

            // 定期检查SW，防止浏览器长期不检查更新
            setInterval(() => {
                if (currentRegistration) {
                    currentRegistration.update();
                }
            }, 10 * 60 * 1000);
        } catch(error) {
            console.error('[SW注册失败]', error);
        }
    }

    // 新SW接管页面
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing || !updating) {
            return;
        }
        refreshing = true;
        showSnackbar('网站更新完成，正在刷新...');
        setTimeout(() => {
            location.reload();
        }, 800);
    });

    window.addEventListener('load', () => {
        registerSW();
    });

    // Butterfly PJAX兼容
    document.addEventListener('pjax:complete', () => {
        if (!navigator.serviceWorker.controller) {
            registerSW();
        }
    });
})();