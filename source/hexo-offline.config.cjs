module.exports = {
  // 只预缓存静态资源，不包含 HTML
  globPatterns: [
    '**/*.{js,css,png,jpg,jpeg,gif,svg,webp,eot,ttf,woff,woff2,mp3}'
  ],
  globDirectory: '.',
  swDest: 'service-worker.js',
  maximumFileSizeToCacheInBytes: 209715200, // 200MB

  // 新版本立即生效
  skipWaiting: true,
  clientsClaim: true,

  // 自动清理过期 precache（静态资源）
  cleanupOutdatedCaches: true,

  runtimeCaching: [
    // —— 按需缓存 HTML 页面 —— 
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'StaleWhileRevalidate', // 先用缓存，后台更新
      options: {
        cacheName: 'page-cache',
        plugins: [
          new workbox.expiration.ExpirationPlugin({
            maxAgeSeconds: 7 * 24 * 60 * 60, // 缓存7天
            purgeOnQuotaError: true
          })
        ]
      }
    },

    // —— JS/CSS 脚本 & 样式（运行时缓存） —— 
    {
      urlPattern: ({ request }) =>
        request.destination === 'script' ||
        request.destination === 'style',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30天
        }
      }
    },

    // —— 图片资源 —— 
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30天
        }
      }
    },

    // —— 音频资源 —— 
    {
      urlPattern: ({ request }) =>
        request.destination === 'audio' ||
        /\.(mp3|wav|ogg)$/i.test(request.url),
      handler: 'CacheFirst',
      options: {
        cacheName: 'audio-cache',
        expiration: {
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1年
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          }),
          new workbox.rangeRequests.RangeRequestsPlugin()
        ]
      }
    },

    // —— CDN 资源 —— 
    {
      urlPattern: /^https:\/\/cdn\.yesandnoandperhaps\.cn\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-cache',
        expiration: {
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1年
        }
      }
    },

    // —— API 请求 —— 
    {
      urlPattern: /^https:\/\/yesandnoandperhaps\.cn\/api\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,  // 这里 NetworkFirst，保留超时
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1年
        }
      }
    }
  ] 
}
