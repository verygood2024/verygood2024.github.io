if ('serviceWorker' in navigator) {
  // 防止 PJAX 重复注册
  if (!navigator.serviceWorker.controller) {
    registerSW();
  }

  // 监听 PJAX 完成（Butterfly 自带 PJAX 事件）
  document.addEventListener('pjax:complete', () => {
    if (!navigator.serviceWorker.controller) {
      registerSW();
    }
  });
}

function registerSW() {
  navigator.serviceWorker.register('/service-worker.js').then(registration => {
    console.log('Service Worker 注册成功:', registration);

    // 监听新版本更新
    registration.onupdatefound = () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('检测到新版本，正在激活...');
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
            }, 300);
    console.error('Service Worker 注册失败:', error);
  });
}
