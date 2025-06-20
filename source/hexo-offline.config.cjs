module.exports = {
  globDirectory: '.',
  swDest: 'service-worker.js',

  // 只预缓存静态资源，排除 hexo-offline.config.cjs
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
    // HTML 页面缓存（导航请求）
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'hexo-v1-page-cache',
        plugins: [
          new workbox.expiration.ExpirationPlugin({
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7天
            purgeOnQuotaError: true
          })
        ]
      }
    },

    // JS/CSS 缓存
    {
      urlPattern: ({ request }) =>
        request.destination === 'script' ||
        request.destination === 'style',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'hexo-v1-static-cache',
        expiration: {
          maxAgeSeconds: 14 * 24 * 60 * 60 // 14天
        }
      }
    },

    // 图片缓存
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'hexo-v1-image-cache',
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30天
        }
      }
    },

    // 音频缓存
    {
      urlPattern: ({ request }) =>
        request.destination === 'audio' ||
        /\.(mp3|wav|ogg)$/i.test(request.url),
      handler: 'CacheFirst',
      options: {
        cacheName: 'hexo-v1-audio-cache',
        expiration: {
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1年
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          }),
          new workbox.rangeRequests.RangeRequestsPlugin()
        ]
      }
    },

    // CDN 缓存
    {
      urlPattern: /^https:\/\/cdn\.yesandnoandperhaps\.cn\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'hexo-v1-cdn-cache',
        expiration: {
          maxAgeSeconds: 365 * 24 * 60 * 60
        }
      }
    },

    // API 缓存（优先网络）
    {
      urlPattern: /^https:\/\/yesandnoandperhaps\.cn\/api\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hexo-v1-api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 365 * 24 * 60 * 60
        }
      }
    },

    // hexo-offline.config.cjs 缓存（确保更新）
    {
      urlPattern: /hexo-offline\.config\.cjs$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hexo-v1-config-cache',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 24 * 60 * 60 // 每天强制检查更新
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    }
  ]
}
