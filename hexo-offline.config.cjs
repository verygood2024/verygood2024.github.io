const fs = require('fs');
const path = require('path');

// 读取动态生成的版本号
const versionFile = path.join(__dirname, 'source', 'cache-version.json');
let CACHE_VERSION = 'v2.6.13'; // 默认值
try {
  const data = JSON.parse(fs.readFileSync(versionFile, 'utf-8'));
  CACHE_VERSION = data.version || CACHE_VERSION;
} catch (e) {
  console.warn('⚠️ 未找到 cache-version.json，使用默认版本号');
}

module.exports = {
  globDirectory: '.',
  swDest: `service-worker-${CACHE_VERSION}.js`,

  globPatterns: [
    '**/*.{js,css,png,jpg,jpeg,gif,svg,webp,eot,ttf,woff,woff2,mp3}'
  ],
  globIgnores: [
    'hexo-offline.config.cjs'
  ],

  maximumFileSizeToCacheInBytes: 209715200, // 200MB

  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,

  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.pathname === '/' || url.pathname.endsWith('/index.html'),
      handler: 'NetworkFirst',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-homepage-cache`,
        networkTimeoutSeconds: 10,
        expiration: {
          maxAgeSeconds: 15 * 60,
          maxEntries: 1
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    },
    {
      urlPattern: /\.html$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-pjax-html-cache`,
        networkTimeoutSeconds: 10,
        expiration: {
          maxAgeSeconds: 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    },
    {
      urlPattern: /^\/page\/\d+\/index\.html$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-pagination-cache`,
        networkTimeoutSeconds: 10,
        expiration: {
          maxAgeSeconds: 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    },
    {
      urlPattern: /^\/posts\/.*\.html$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-article-cache`,
        networkTimeoutSeconds: 10,
        expiration: {
          maxAgeSeconds: 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    },
    {
      urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-static-cache`,
        expiration: {
          maxAgeSeconds: 7 * 24 * 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-image-cache`,
        expiration: {
          maxAgeSeconds: 3 * 24 * 60 * 60,
          maxEntries: 100
        }
      }
    },
    {
      urlPattern: ({ request }) =>
        request.destination === 'audio' || /\.(mp3|wav|ogg)$/i.test(request.url),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-audio-cache`,
        expiration: {
          maxAgeSeconds: 7 * 24 * 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          }),
          new workbox.rangeRequests.RangeRequestsPlugin()
        ]
      }
    },
    {
      urlPattern: /^https:\/\/cdn\.yesandnoandperhaps\.cn\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-cdn-cache`,
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60
        }
      }
    },
    {
      urlPattern: /^https:\/\/yesandnoandperhaps\.cn\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-api-cache`,
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60
        }
      }
    },
    {
      urlPattern: /hexo-offline\.config\.cjs$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-config-cache`,
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 24 * 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    },
    {
      urlPattern: ({ request }) => request.destination === 'font' || /\.(eot|ttf|woff|woff2)$/i.test(request.url),
      handler: 'CacheFirst',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-font-cache`,
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60 // 保留一个月
        }
      }
    }
  ]
};
