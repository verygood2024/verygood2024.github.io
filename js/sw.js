if ('serviceWorker' in navigator) {
  // 先注销所有已注册的旧的 Service Worker
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister().then(() => {
        console.log('旧的 Service Worker 被注销');
      }).catch((error) => {
        console.log('注销旧 Service Worker 失败', error);
      });
    }
  });

  // 注册新的 Service Worker
  navigator.serviceWorker.register('/service-worker.js?v=' + new Date().getTime()).then(function(registration) {
    console.log('新的 Service Worker 已注册:', registration);

    // 激活新的 Service Worker
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    // 当新的 Service Worker 安装成功后，立即激活
    registration.onupdatefound = () => {
      const newWorker = registration.installing;

      newWorker.onstatechange = () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            console.log('新的 Service Worker 已安装');
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      };
    };
  }).catch(function(error) {
    console.error('Service Worker 注册失败:', error);
  });
}

