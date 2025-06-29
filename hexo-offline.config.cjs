module.exports = {
  globDirectory: '.',
  swDest: 'service-worker.js',
  
  cacheId: 'hexo-offline-v2', 

  globPatterns: [
    '**/*.{js,css,html,png,jpg,jpeg,gif,svg,webp,eot,ttf,woff,woff2,mp3}'
  ],
  globIgnores: [
    'hexo-offline.config.cjs'
  ],
  maximumFileSizeToCacheInBytes: 209715200,

  // 👇 添加强制生效策略
  clientsClaim: true,
  skipWaiting: true,
};
