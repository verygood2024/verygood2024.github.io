const path = require('path');
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

module.exports = {
    // 自定义SW源码
    swSrc:
        path.join(
            __dirname,
            'custom-service-worker.js'
        ),
    // 输出
    swDest:
        path.join(
            publicDir,
            'service-worker.js'
        ),
    // Hexo生成目录
    globDirectory:
        publicDir,
    // 预缓存资源
    globPatterns:[
        '**/*.{js,css,svg,eot,ttf,woff,woff2}'
    ],
    globIgnores:[
        'service-worker.js',
        'workbox-*.js',
        'version-counter.json',
        'cache-version*.json',
        "app.js"
    ],
    maximumFileSizeToCacheInBytes:
        200 * 1024 * 1024
};