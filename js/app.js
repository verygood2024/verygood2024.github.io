if ('serviceWorker' in navigator) {
  // 监听来自 Service Worker 的消息
  navigator.serviceWorker.addEventListener('message', event => {
    const data = event.data;
    if (data.type === 'showSnackbar' && data.text) {
      safeSnackbar(data.text);
    }
  });

  // 监听控制器变更，刷新页面
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('控制器变更，新 SW 已接管，刷新页面...');
    window.location.reload();
  });

  // 注册 Service Worker
  if (!navigator.serviceWorker.controller) {
    registerSW();
  }

  document.addEventListener('pjax:complete', () => {
    if (!navigator.serviceWorker.controller) {
      registerSW();
    }
  });

  function registerSW() {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker 注册成功:', registration);

      registration.onupdatefound = () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.onstatechange = () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // 旧 SW 控制页面，通知新 SW 跳过等待
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                safeSnackbar('检测到新版本，正在自动刷新...');
              } else {
                safeSnackbar('内容已缓存，可离线使用');
              }
            }
          };
        }
      };
    }).catch(error => {
      console.error('Service Worker 注册失败:', error);
      setTimeout(() => {
        safeSnackbar('缓存器加载失败，请检查网络连接或清除浏览器缓存后重试。');
      }, 3000);
      setTimeout(() => {
        safeSnackbar('还可尝试手动刷新当前界面。');
      }, 7000);
    });
  }

  // 安全调用 btf.snackbarShow
  function safeSnackbar(text) {
    if (typeof btf !== 'undefined' && typeof btf.snackbarShow === 'function') {
      btf.snackbarShow(text);
    } else {
      console.warn('btf.snackbarShow 不存在，尝试重试...');
      const interval = setInterval(() => {
        if (typeof btf !== 'undefined' && typeof btf.snackbarShow === 'function') {
          btf.snackbarShow(text);
          clearInterval(interval);
        }
      }, 500);
    }
  }
}
