const fs = require('fs');
const path = require('path');

// 读取动态生成的版本号
const versionFile = path.join(__dirname,'cache-version-prod.json');
let CACHE_VERSION = 'v2.6.13';
try {
  const data = JSON.parse(fs.readFileSync(versionFile, 'utf-8'));
  CACHE_VERSION = data.version || CACHE_VERSION;
} catch (e) {
  console.warn('⚠️ 未找到 cache-version.json，使用默认版本号');
}

module.exports = {
  globDirectory: '.',
  swDest: `service-worker-${CACHE_VERSION}.js`,  // 生成带有版本号的 service worker 文件

  globPatterns: [
    '**/*.{js,css,png,jpg,jpeg,gif,svg,webp,eot,ttf,woff,woff2,mp3}'
  ],
  globIgnores: [
    'hexo-offline.config.cjs',
    'cache-version-preview.json',
    'cache-version-prod.json',
    'service-worker-*.js',
    'service-worker-*.js.map',
    'version-counter.json',
    'version-prod.js',
    'version-preview.js',
    'workbox-*.js',
    'workbox-*.js.map',
    'cache-version.json',
    '**/app.js'
  ],

  maximumFileSizeToCacheInBytes: 209715200, // 200MB

  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,

  runtimeCaching: [
    // 防止缓存版本号文件
    {
      urlPattern: /cache-version\.json$/,
      handler: 'NetworkOnly',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-version-cache`,
      }
    },
    // 统一的 7 天缓存配置
    {
      urlPattern: ({ url }) => url.pathname === '/' || url.pathname.endsWith('.html'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-html-cache`,
        networkTimeoutSeconds: 10,
        expiration: {
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 天
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    },
    // 脚本和样式缓存
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
    // 图片缓存
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-image-cache`,
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }
      }
    },
    // 音频缓存
    {
      urlPattern: ({ request }) =>
        request.destination === 'audio' || /\.(mp3|wav|ogg)$/i.test(request.url),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-audio-cache`,
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          }),
          new workbox.rangeRequests.RangeRequestsPlugin()
        ]
      }
    },
    // 外部 CDN 缓存
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
    // 外部 API 缓存
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
    // 配置文件缓存
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
    // 字体缓存
    {
      urlPattern: ({ request }) => request.destination === 'font' || /\.(eot|ttf|woff|woff2)$/i.test(request.url),
      handler: 'CacheFirst',
      options: {
        cacheName: `hexo-${CACHE_VERSION}-font-cache`,
        expiration: {
          maxAgeSeconds: 3 * 30 * 24 * 60 * 60 // 保留三个月
        }
      }
    }
  ]
};
