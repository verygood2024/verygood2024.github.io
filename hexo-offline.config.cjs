module.exports = {
  globDirectory: '.',
  swDest: 'service-worker.js',

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
    // 首页缓存（含 / 和 index.html）
    {
      urlPattern: /^\/(?:index\.html)?$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hexo-v1-homepage-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxAgeSeconds: 24 * 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    },

    // 分页页面（如 /page/2/index.html）
    {
      urlPattern: /^\/page\/\d+\/index\.html$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hexo-v1-pagination-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxAgeSeconds: 24 * 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    },

    // 文章页缓存
    {
      urlPattern: /^\/posts\/.*\.html$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hexo-v1-article-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxAgeSeconds: 24 * 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      }
    },

    // 通用 HTML 页面缓存（分类页 /categories，标签页 /tags，自定义页面等）
    {
      urlPattern: /\.html$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hexo-v1-html-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxAgeSeconds: 24 * 60 * 60
        },
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200]
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
          maxAgeSeconds: 7 * 24 * 60 * 60
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
          maxAgeSeconds: 30 * 24 * 60 * 60
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
          maxAgeSeconds: 365 * 24 * 60 * 60
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
      urlPattern: /^https:\/\/cdn\.yesandnoandperhaps\.cn\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'hexo-v1-cdn-cache',
        expiration: {
          maxAgeSeconds: 365 * 24 * 60 * 60
        }
      }
    },

    // API 缓存
    {
      urlPattern: /^https:\/\/yesandnoandperhaps\.cn\/api\/.*/i,
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

    // 配置文件缓存
    {
      urlPattern: /hexo-offline\.config\.cjs$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hexo-v1-config-cache',
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
    }
  ]

};
