// ---------------------------
// 🔹 全局版本号统一（正式版）
// ---------------------------
let CACHE_VERSION = '2025.11.02 v2.7.1';

try {
  importScripts('/version-prod.js'); // 载入版本定义
  if (self.__SITE_VERSION_PROD__) CACHE_VERSION = self.__SITE_VERSION_PROD__;
} catch (e) {
  console.warn('[SW] 无法加载 version-prod.js，使用默认版本');
}

self.addEventListener('install', event => {
  self.skipWaiting(); // 立即激活
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [
    `hexo-${CACHE_VERSION}-homepage-cache`,
    `hexo-${CACHE_VERSION}-article-cache`,
    `hexo-${CACHE_VERSION}-static-cache`
  ];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
      console.log(`[SW] 已激活版本: ${CACHE_VERSION}`);
    })
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 向客户端发送消息
function sendMessageToClients(msg) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'showSnackbar', text: msg });
    });
  });
}
