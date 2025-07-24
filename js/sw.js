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

// 监听来自页面的消息，支持跳过等待
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
