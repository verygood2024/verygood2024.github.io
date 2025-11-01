(function () {
    if (!('serviceWorker' in navigator)) return;

    // ---------------------------
    // 🔹 正式版版本号检测逻辑
    // ---------------------------
    const LOCAL_CACHE_VERSION_KEY = 'hexo_cache_version';

    async function getRemoteVersion() {
        try {
            // 固定使用正式版 JSON
            const response = await fetch('/cache-version-prod.json', { cache: 'no-store' });
            if (!response.ok) {
                console.log('没有找到 /cache-version-prod.json，视为最新版本');
                return null; // 没有文件时返回 null，视为最新版本
            }
            const { version } = await response.json();
            return version;
        } catch (err) {
            console.warn('远程正式版本获取失败:', err);
            return null; // 出错时也视为最新版本
        }
    }

    async function checkCacheVersion() {
        try {
            const remoteVersion = await getRemoteVersion();
            const localVersion = localStorage.getItem(LOCAL_CACHE_VERSION_KEY);
            const currentVersion = window.__SITE_VERSION__ || remoteVersion;

            if (remoteVersion === null) {
                console.log('没有新版本，使用当前版本:', currentVersion);
                return; // 如果没有远程版本，则跳过检查
            }

            // 如果缓存版本一致或是刚刚清除缓存，跳过刷新
            if (localVersion === remoteVersion) {
                console.log(`缓存版本一致（${currentVersion}），无需更新`);
                return;
            }

            // 检测到新缓存版本
            console.log(`检测到新缓存版本：${remoteVersion}（旧版本：${localVersion || '无'}）`);
            localStorage.setItem(LOCAL_CACHE_VERSION_KEY, remoteVersion);

            // 清除旧缓存
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k)));
                console.log('旧缓存已清除');
            }

            // 使用安全 snackbar 通知
            showSnackbar('检测到网站更新，正在刷新...');
            setTimeout(() => window.location.reload(true), 800);

        } catch (err) {
            console.warn('缓存版本检查失败:', err);
        }
    }

    // 页面加载后立即检测
    document.addEventListener('DOMContentLoaded', checkCacheVersion);

    // ---------------------------
    // 🔹 Service Worker 注册逻辑
    // ---------------------------
    let hasReloaded = false;

    const registerSW = () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('Service Worker 注册成功:', registration);

            // 如果有新版本的 Service Worker 被安装，立刻跳过等待，激活它
            registration.onupdatefound = () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.onstatechange = () => {
                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // 跳过等待，使新 SW 立刻生效
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                showSnackbar('检测到新版本，正在自动刷新...');
                            } else {
                                showSnackbar('内容已缓存，可离线使用');
                            }
                        }
                    };
                }
            };

            // 如果当前已有控制器，立刻刷新页面以应用新 SW
            if (navigator.serviceWorker.controller) {
                console.log('有新的 Service Worker，刷新页面...');
                window.location.reload();
            }

        }).catch(error => {
            console.error('Service Worker 注册失败:', error);
            showSnackbar('缓存器加载失败，请检查网络连接或清除浏览器缓存后重试。');
        });
    };

    // SW 消息监听
    navigator.serviceWorker.addEventListener('message', event => {
        const data = event.data;
        if (data.type === 'showSnackbar' && data.text) {
            showSnackbar(data.text);
        }
    });

    // 控制器变更时刷新
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hasReloaded) return;
        hasReloaded = true;
        console.log('新 SW 已接管，刷新页面...');
        window.location.reload();
    });

    // 初次注册
    if (!navigator.serviceWorker.controller) registerSW();

    // PJAX 完成后注册（防止重复）
    document.addEventListener('pjax:complete', () => {
        if (!navigator.serviceWorker.controller) registerSW();
    });

    // ---------------------------
    // 🔹 安全 snackbar 实现（无延迟轮询）
    // ---------------------------
    function showSnackbar(text) {
        // 如果 btf 已准备好
        if (window.btf?.snackbarShow) {
            window.btf.snackbarShow(text);
            return;
        }

        // 如果主题稍后加载（常见于异步主题脚本）
        const handleReady = () => {
            if (window.btf?.snackbarShow) {
                window.btf.snackbarShow(text);
                document.removeEventListener('btf-ready', handleReady);
            }
        };

        // 监听自定义 ready 事件
        document.addEventListener('btf-ready', handleReady);

        // 若主题未触发事件，则在全局对象上注册回调
        Object.defineProperty(window, '__btf_snackbar_queue__', {
            configurable: true,
            set(fn) {
                if (typeof fn === 'function') {
                    fn(text);
                }
            }
        });
    }
})();
