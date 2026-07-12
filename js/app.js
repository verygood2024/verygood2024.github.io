(function () {
    if (!('serviceWorker' in navigator)) return;

    const VERSION_KEY = 'hexo_cache_version';
    let refreshing = false;
    let versionChecking = false;

    function showSnackbar(text) {
        if (window.btf?.snackbarShow) {
            window.btf.snackbarShow(text);
        } else {
            console.log('[Snackbar]', text);
            window.__swSnackbarQueue = window.__swSnackbarQueue || [];
            window.__swSnackbarQueue.push(text);
        }
    }

    async function getRemoteVersion() {
        let retry = 0;

        while (true) {
            retry++;

            try {
                const response = await fetch(
                    `/cache-version-prod.json`,
                    {
                        cache: 'no-store'
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}`
                    );
                }

                const data = await response.json();

                if (!data.version) {
                    throw new Error(
                        '版本号为空'
                    );
                }

                console.log(
                    `[SW] 获取版本成功: ${data.version}`
                );

                return data.version;

            } catch (e) {

                console.warn(
                    `[SW] 第${retry}次获取失败`,
                    e
                );
                await new Promise(resolve => {
                    setTimeout(
                        resolve,
                        Math.min(
                            retry * 300,
                            3000
                        )
                    );
                });
            }
        }
    }

    async function checkVersion(registration) {
        if (versionChecking) return;
        versionChecking = true;

        try {
            const remote = await getRemoteVersion();
            const local = localStorage.getItem(VERSION_KEY);

            if (remote === local) {
                console.log(
                    `[SW] 当前版本 ${remote}`
                );
                return;
            }

            showSnackbar(
                '发现网站更新，正在后台下载关键资源...'
            );

            await registration.update();

        } catch (e) {
            console.error(
                '[SW] 更新检查失败',
                e
            );
        } finally {
            versionChecking = false;
        }
    }

    function watchServiceWorker(registration) {
        registration.addEventListener(
            'updatefound',
            () => {
                const worker = registration.installing;
                if (!worker) return;

                worker.addEventListener(
                    'statechange',
                    () => {
                        console.log(
                            '[SW状态]',
                            worker.state
                        );

                        if (
                            worker.state === 'installed' &&
                            navigator.serviceWorker.controller
                        ) {
                            showSnackbar(
                                '关键资源更新完成，正在应用...'
                            );
                        }
                    }
                );
            }
        );
    }

    async function registerSW() {
        try {
            const registration =
                await navigator.serviceWorker.register(
                    '/service-worker.js',
                    {
                        updateViaCache: 'none'
                    }
                );

            console.log(
                '[SW] 注册成功'
            );

            watchServiceWorker(registration);

            await registration.update();

            await checkVersion(registration);

            setInterval(
                () => {
                    checkVersion(registration);
                },
                5 * 60 * 1000
            );

        } catch (e) {
            console.error(
                '[SW] 注册失败',
                e
            );
        }
    }

    navigator.serviceWorker.addEventListener(
        'controllerchange',
        () => {
            if (refreshing) return;

            refreshing = true;

            showSnackbar(
                '网站更新完成，正在刷新...'
            );

            setTimeout(
                () => {
                    location.reload();
                },
                1000
            );
        }
    );

    window.addEventListener(
        'load',
        registerSW
    );
})();