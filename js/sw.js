if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    const data = event.data;
    if (data.type === 'showSnackbar' && data.text) {
      if (typeof btf !== 'undefined' && typeof btf.snackbarShow === 'function') {
        btf.snackbarShow(data.text);
      } else {
        console.warn('btf.snackbarShow 不存在');
      }
    }
  });

  // 你已有的注册代码
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
              // 这里页面环境，直接调用可以
              btf.snackbarShow('检测到新版本，正在自动刷新...');
              window.location.reload();
            }
          };
        }
      };
    }).catch(error => {
      btf.snackbarShow('缓存器加载失败，请检查网络连接或清除浏览器缓存后重试。');
      setTimeout(() => {
        btf.snackbarShow('还可尝试手动刷新当前界面。');
      }, 3000);
      console.error('Service Worker 注册失败:', error);
    });
  }
}
