if ('serviceWorker' in navigator) {
  // 监听来自 Service Worker 的消息
  navigator.serviceWorker.addEventListener('message', event => {
    const data = event.data;
    if (data.type === 'showSnackbar' && data.text) {
      // 通过主线程调用 btf.snackbarShow
      safeSnackbar(data.text);
    }
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
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('检测到新版本的 Service Worker，正在刷新页面...');
              safeSnackbar('检测到新版本，正在自动刷新...');
              window.location.reload();
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

  // 安全地调用 btf.snackbarShow
  function safeSnackbar(text) {
    if (typeof btf !== 'undefined' && typeof btf.snackbarShow === 'function') {
      btf.snackbarShow(text);
    } else {
      console.warn('btf.snackbarShow 不存在，尝试重试...');
      // 延迟重试，直到 btf.snackbarShow 可用
      const interval = setInterval(() => {
        if (typeof btf !== 'undefined' && typeof btf.snackbarShow === 'function') {
          btf.snackbarShow(text);
          clearInterval(interval);  // 成功后清除定时器
        }
      }, 500); // 每500ms检查一次
    }
  }
}
