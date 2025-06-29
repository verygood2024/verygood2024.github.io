  // 注销所有现有的 Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister().then(() => {
          console.log('Service Worker 已注销');
        }).catch(error => {
          console.log('注销失败:', error);
        });
      });
    });
  }

  // 清除浏览器缓存
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
        .then(() => {
          console.log('所有缓存已清除');
        })
        .catch((error) => {
          console.log('清除缓存失败:', error);
        });
    });
  }

  // 强制页面刷新，确保使用最新资源
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();  // 页面刷新，确保加载最新内容
    });
  }