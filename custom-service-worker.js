importScripts(
    'https://cdn.bootcdn.net/ajax/libs/workbox-sw/7.3.0/workbox-sw.js'
);


// 修改Workbox模块来源
workbox.setConfig({

    modulePathPrefix:
    'https://cdn.bootcdn.net/ajax/libs/'

});

const {
    precaching,
    routing,
    strategies,
    expiration,
    cacheableResponse,
    broadcastUpdate
} = workbox;

precacheManifest();

function precacheManifest() {
    precaching.precacheAndRoute(self.__WB_MANIFEST);
}

// ==================================
// 防止异常缓存
// ==================================
const validResponsePlugin = new cacheableResponse.CacheableResponsePlugin({
    statuses: [200]
});

// 拒绝缓存
routing.registerRoute(
    ({url}) =>
        url.pathname.endsWith('/version-counter.json') ||
        url.pathname.endsWith('/cache-version-prod.json'),

    new strategies.NetworkOnly()
);

routing.registerRoute(

    ({url}) =>
        url.pathname.endsWith('/app.js'),
    new strategies.NetworkFirst({
        cacheName:'hexo-register',
        networkTimeoutSeconds:10,
        plugins:[
            validResponsePlugin
        ]
    })
);

// ==================================
// HTML
// NetworkFirst
// ==================================
routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new strategies.NetworkFirst({
        cacheName: 'hexo-html',
        networkTimeoutSeconds: 10,
        plugins: [
            validResponsePlugin,
            {
                fetchDidFail: async ({ request }) => {
                    const clients = await self.clients.matchAll();
                    clients.forEach(client => {
                        client.postMessage({
                            type: 'HTML_CACHE_FALLBACK',
                            url: request.url
                        });
                    });
                }
            }
        ]
    })
);

// ==================================
// JS CSS
// StaleWhileRevalidate
// ==================================


routing.registerRoute(
    ({ request }) =>
        request.destination === 'script' ||
        request.destination === 'style',
    new strategies.StaleWhileRevalidate({
        cacheName: 'hexo-static',
        plugins: [
            validResponsePlugin,
            new broadcastUpdate.BroadcastUpdatePlugin({
                channelName: 'hexo-static-update'
            })
        ]
    })
);

// ==================================
// 图片
// CacheFirst
// ==================================
routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new strategies.CacheFirst({
        cacheName: 'hexo-images',
        plugins: [
            validResponsePlugin,
            new expiration.ExpirationPlugin({
                maxAgeSeconds: 365 * 24 * 60 * 60
            })
        ]
    })
);

// ==================================
// 字体
// CacheFirst
// ==================================
routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new strategies.CacheFirst({
        cacheName: 'hexo-fonts',
        plugins: [
            validResponsePlugin,
            new expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 365 * 24 * 60 * 60
            })
        ]
    })
);

// ==================================
// 音频
// CacheFirst
// ==================================
routing.registerRoute(
    ({ request }) => request.destination === 'audio',
    new strategies.CacheFirst({
        cacheName: 'hexo-audio',
        plugins: [
            validResponsePlugin,
            new expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 180 * 24 * 60 * 60
            })
        ]
    })
);

// ==================================
// SW 更新
// ==================================
self.addEventListener('message', event => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});