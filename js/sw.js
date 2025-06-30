// sw.js
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

// 定义一个函数来发送消息到所有的客户端（浏览器窗口）
function sendMessageToClients(msg) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'showSnackbar',
        text: msg
      });
    });
  });
}

// 示例：当 Service Worker 更新时，发出更新提示
self.addEventListener('updatefound', () => {
  sendMessageToClients('检测到新版本，正在自动刷新...');
  // 例如，在安装过程中发送消息
  self.skipWaiting();
});
