(function () {
    if (!('serviceWorker' in navigator)) return;

    const LOCAL_CACHE_VERSION_KEY = 'hexo_cache_version';
    let hasReloaded = false;

    // ---------------------------
    // 🔹 获取远程版本号（不缓存）
    // ---------------------------
    async function getRemoteVersion() {
        try {
            const response = await fetch(`/cache-version-prod.json?v=${Date.now()}`, {
                cache: 'no-store'
            });
            if (!response.ok) {
                console.log('⚠️ 未找到 /cache-version-prod.json，视为最新版本');
                return null;
            }
            const { version } = await response.json();
            return version;
        } catch (err) {
            console.warn('⚠️ 获取远程版本失败:', err);
            return null;
        }
    }

    // ---------------------------
    // 🔹 检查缓存版本号
    // ---------------------------
    async function checkCacheVersion() {
        try {
            const remoteVersion = await getRemoteVersion();
            const localVersion = localStorage.getItem(LOCAL_CACHE_VERSION_KEY);
            const currentVersion = window.__SITE_VERSION_PROD__ || remoteVersion;

            if (!remoteVersion) {
                console.log('✅ 无远程版本或获取失败，跳过更新检查');
                return;
            }

            if (remoteVersion === localVersion) {
                console.log(`✅ 缓存版本一致（${remoteVersion}），无需更新`);
                return;
            }

            console.log(`🆕 检测到新缓存版本：${remoteVersion}（旧：${localVersion || '无'}）`);
            localStorage.setItem(LOCAL_CACHE_VERSION_KEY, remoteVersion);

            // ---------------------------
            // 🔹 强制清除缓存并刷新
            // ---------------------------
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k)));
                console.log('🧹 已清除旧缓存');
            }

            showSnackbar('检测到网站更新，正在刷新...');
            setTimeout(() => {
                location.reload(true);
            }, 800);
        } catch (err) {
            console.warn('❌ 缓存版本检查失败:', err);
        }
    }

    // ---------------------------
    // 🔹 Service Worker 注册逻辑
    // ---------------------------
    async function registerSW() {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                updateViaCache: 'none' // 防止 SW 被旧缓存阻止更新
            });

            console.log('✅ Service Worker 注册成功:', registration);

            // 🔸 定期检查更新（防止 SW 更新被跳过）
            setInterval(() => registration.update(), 1000 * 60 * 5); // 每 5 分钟主动检查一次

            registration.onupdatefound = () => {
                const newWorker = registration.installing;
                if (!newWorker) return;
                newWorker.onstatechange = () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            console.log('🔄 新版本 Service Worker 安装完成，跳过等待...');
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            showSnackbar('检测到新版本，正在自动刷新...');
                        } else {
                            console.log('📦 首次安装完成，可离线使用');
                            showSnackbar('内容已缓存，可离线使用');
                        }
                    }
                };
            };
        } catch (err) {
            console.error('❌ Service Worker 注册失败:', err);
            showSnackbar('缓存器加载失败，请清除浏览器缓存后重试。');
        }
    }

    // ---------------------------
    // 🔹 监听控制权变更，强制刷新
    // ---------------------------
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hasReloaded) return;
        hasReloaded = true;
        console.log('⚡ 新 Service Worker 接管，刷新页面...');
        location.reload();
    });

    // ---------------------------
    // 🔹 初始化
    // ---------------------------
    window.addEventListener('load', async () => {
        await checkCacheVersion();
        await registerSW();
    });

    // ---------------------------
    // 🔹 PJAX 兼容（部分主题）
    // ---------------------------
    document.addEventListener('pjax:complete', async () => {
        if (!navigator.serviceWorker.controller) {
            await registerSW();
        }
    });

    // ---------------------------
    // 🔹 Snackbar 提示
    // ---------------------------
    function showSnackbar(text) {
        if (window.btf?.snackbarShow) return window.btf.snackbarShow(text);

        const handleReady = () => {
            if (window.btf?.snackbarShow) {
                window.btf.snackbarShow(text);
                document.removeEventListener('btf-ready', handleReady);
            }
        };
        document.addEventListener('btf-ready', handleReady);

        Object.defineProperty(window, '__btf_snackbar_queue__', {
            configurable: true,
            set(fn) {
                if (typeof fn === 'function') fn(text);
            }
        });
    }
})();
