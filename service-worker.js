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
    precaching.precacheAndRoute([{"revision":"35e79211a536fb1b45677020bb1d89ca","url":"version-prod.js"},{"revision":"c29c092c5c3775053819f707490ef488","url":"version-preview.js"},{"revision":"dbbac3f0b9f9b90d46aa7b2701d3b952","url":"custom-service-worker.js"},{"revision":"de63970719fb650aee5e0fc7da2d2e6f","url":"pluginsSrc/vanilla-lazyload/dist/lazyload.iife.min.js"},{"revision":"dbed8b09fd85cceca77f58abdcdc8867","url":"pluginsSrc/valine/dist/Valine.min.js"},{"revision":"3ba6a3f6e22122d8f5ed22c423299981","url":"pluginsSrc/typed.js/dist/typed.umd.js"},{"revision":"0869ece290a2470b9e13dba8bff42ea2","url":"pluginsSrc/twikoo/dist/twikoo.all.min.js"},{"revision":"7659a5599c2cb206218bcb4b1389d26e","url":"pluginsSrc/prismjs/prism.js"},{"revision":"ffdf7bdb8ddaf0c89a4e4225e1086264","url":"pluginsSrc/prismjs/plugins/line-numbers/prism-line-numbers.min.js"},{"revision":"4f48958b1802a9d99581aa5ab1e3f621","url":"pluginsSrc/prismjs/plugins/autoloader/prism-autoloader.min.js"},{"revision":"d810aff16a7f45392bdeec5493ebee8e","url":"pluginsSrc/pjax/pjax.min.js"},{"revision":"094ce2780af2906e8916dc4c4eab6ee1","url":"pluginsSrc/pace-js/pace.min.js"},{"revision":"7bba84cb68736f6ea9ae77cd934d995a","url":"pluginsSrc/pace-js/themes/blue/pace-theme-minimal.css"},{"revision":"8f19a3527021a6268cd8488a5debe7f8","url":"pluginsSrc/node-snackbar/dist/snackbar.min.js"},{"revision":"4220368aced9a5ce011f2ce9bd8b1035","url":"pluginsSrc/node-snackbar/dist/snackbar.min.css"},{"revision":"32ff6ba78bb3380c4130f3d7dfeb864f","url":"pluginsSrc/mermaid/dist/mermaid.min.js"},{"revision":"348914dc9144b3441a2a0c9687604a16","url":"pluginsSrc/medium-zoom/dist/medium-zoom.min.js"},{"revision":"3a5119912cc48753a6c9aba5c6102236","url":"pluginsSrc/mathjax/tex-mml-chtml.js"},{"revision":"6fe3b762afa431533f1a0d933c5bee1d","url":"pluginsSrc/katex/dist/katex.min.css"},{"revision":"b8b8393d2e65fcebda5fa99fa3264f41","url":"pluginsSrc/katex/dist/fonts/KaTeX_Typewriter-Regular.woff2"},{"revision":"0e0460587676d22eae09accd6dcfebc6","url":"pluginsSrc/katex/dist/fonts/KaTeX_Typewriter-Regular.woff"},{"revision":"6bf4287568e1d3004b54d5d60f9f08f9","url":"pluginsSrc/katex/dist/fonts/KaTeX_Typewriter-Regular.ttf"},{"revision":"61522cd3d9043622e235ab57762754f2","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size4-Regular.woff2"},{"revision":"3045a61f722bc4b198450ce69b3e3824","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size4-Regular.woff"},{"revision":"27a23ee69999affa55491c7dab8e53bf","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size4-Regular.ttf"},{"revision":"9108a400f4787cffdcc3a3b813401e6a","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size3-Regular.woff2"},{"revision":"4de844d4552e941f6b9c38837a8d487b","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size3-Regular.woff"},{"revision":"963af864cbb10611ba33267ba7953777","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size3-Regular.ttf"},{"revision":"95a1da914c20455a07b7c9e2dcf2836d","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size2-Regular.woff2"},{"revision":"b0628bfd27c979a09f702a2277979888","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size2-Regular.woff"},{"revision":"1fdda0e59ed35495ebac28badf210574","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size2-Regular.ttf"},{"revision":"82ef26dc680ba60d884e051c73d9a42d","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size1-Regular.woff2"},{"revision":"4788ba5b6247e336f734b742fe9900d5","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size1-Regular.woff"},{"revision":"0d8d9204004bdf126342605f7bbdffe6","url":"pluginsSrc/katex/dist/fonts/KaTeX_Size1-Regular.ttf"},{"revision":"1b3161eb8cc67462d6e8c2fb96c68507","url":"pluginsSrc/katex/dist/fonts/KaTeX_Script-Regular.woff2"},{"revision":"a82fa2a7e18b8c7a1a9f6069844ebfb9","url":"pluginsSrc/katex/dist/fonts/KaTeX_Script-Regular.woff"},{"revision":"a189c37d73ffce63464635dc12cbbc96","url":"pluginsSrc/katex/dist/fonts/KaTeX_Script-Regular.ttf"},{"revision":"1ac3ed6ebe34e473519ca1da86f7a384","url":"pluginsSrc/katex/dist/fonts/KaTeX_SansSerif-Regular.woff2"},{"revision":"5f8637ee731482c44a37789723f5e499","url":"pluginsSrc/katex/dist/fonts/KaTeX_SansSerif-Regular.woff"},{"revision":"3243452ee6817acd761c9757aef93c29","url":"pluginsSrc/katex/dist/fonts/KaTeX_SansSerif-Regular.ttf"},{"revision":"e934cbc86e2d59ceaf04102c43dc0b50","url":"pluginsSrc/katex/dist/fonts/KaTeX_SansSerif-Italic.woff2"},{"revision":"ef725de572b71381dccf53918e300744","url":"pluginsSrc/katex/dist/fonts/KaTeX_SansSerif-Italic.woff"},{"revision":"f60b4a34842bb524b562df092917a542","url":"pluginsSrc/katex/dist/fonts/KaTeX_SansSerif-Italic.ttf"},{"revision":"ad546b4719bcf690a3604944b90b7e42","url":"pluginsSrc/katex/dist/fonts/KaTeX_SansSerif-Bold.woff2"},{"revision":"0e897d27f063facef504667290e408bd","url":"pluginsSrc/katex/dist/fonts/KaTeX_SansSerif-Bold.woff"},{"revision":"f2ac73121357210d91e5c3eaa42f72ea","url":"pluginsSrc/katex/dist/fonts/KaTeX_SansSerif-Bold.ttf"},{"revision":"d8b7a801bd87b324efcbae7394119c24","url":"pluginsSrc/katex/dist/fonts/KaTeX_Math-Italic.woff2"},{"revision":"ed7aea12d765f9e2d0f9bc7fa2be626c","url":"pluginsSrc/katex/dist/fonts/KaTeX_Math-Italic.woff"},{"revision":"fe5ed5875d95b18c98546cb4f47304ff","url":"pluginsSrc/katex/dist/fonts/KaTeX_Math-Italic.ttf"},{"revision":"1320454d951ec809a7dbccb4f23fccf0","url":"pluginsSrc/katex/dist/fonts/KaTeX_Math-BoldItalic.woff2"},{"revision":"48155e43d9a284b54753e50e4ba586dc","url":"pluginsSrc/katex/dist/fonts/KaTeX_Math-BoldItalic.woff"},{"revision":"6589c4f1f587f73f0ad0af8ae35ccb53","url":"pluginsSrc/katex/dist/fonts/KaTeX_Math-BoldItalic.ttf"},{"revision":"f8a7f19f45060f7a177314855b8c7aa3","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-Regular.woff2"},{"revision":"f1cdb692ee31c10b37262caffced5271","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-Regular.woff"},{"revision":"818582dae57e6fac46202cfd844afabb","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-Regular.ttf"},{"revision":"652970624cde999882102fa2b6a8871f","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-Italic.woff2"},{"revision":"8ffd28f6390231548ead99d7835887fa","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-Italic.woff"},{"revision":"39349e0a2b366f38e2672b45aded2030","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-Italic.ttf"},{"revision":"d873734390c716d6e18ff3f71ac6eb8b","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-BoldItalic.woff2"},{"revision":"5f875f986a9bce1264e8c42417b56f74","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-BoldItalic.woff"},{"revision":"52fb39b0434c463d5df32419608ab08a","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-BoldItalic.ttf"},{"revision":"a9382e25bcf75d856718fcef54d7acdb","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-Bold.woff2"},{"revision":"4cdba6465ab9fac5d3833c6cdba7a8c3","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-Bold.woff"},{"revision":"8e431f7ece346b6282dae3d9d0e7a970","url":"pluginsSrc/katex/dist/fonts/KaTeX_Main-Bold.ttf"},{"revision":"f9e6a99f4a543b7d6cad1efb6cf1e4b1","url":"pluginsSrc/katex/dist/fonts/KaTeX_Fraktur-Regular.woff2"},{"revision":"e435cda5784e21b26ab2d03fbcb56a99","url":"pluginsSrc/katex/dist/fonts/KaTeX_Fraktur-Regular.woff"},{"revision":"97a699d83318e9334a0deaea6ae5eda2","url":"pluginsSrc/katex/dist/fonts/KaTeX_Fraktur-Regular.ttf"},{"revision":"796f3797cdf36fcaea18c3070a608378","url":"pluginsSrc/katex/dist/fonts/KaTeX_Fraktur-Bold.woff2"},{"revision":"40934fc076960bb989d590db044fef62","url":"pluginsSrc/katex/dist/fonts/KaTeX_Fraktur-Bold.woff"},{"revision":"b9d7c4497cab3702487214651ab03744","url":"pluginsSrc/katex/dist/fonts/KaTeX_Fraktur-Bold.ttf"},{"revision":"08d95d99bf4a2b2dc7a876653857f154","url":"pluginsSrc/katex/dist/fonts/KaTeX_Caligraphic-Regular.woff2"},{"revision":"a25140fbe6692bffe71a2ab861572eb3","url":"pluginsSrc/katex/dist/fonts/KaTeX_Caligraphic-Regular.woff"},{"revision":"e6fb499fc8f9925eea3138cccba17fff","url":"pluginsSrc/katex/dist/fonts/KaTeX_Caligraphic-Regular.ttf"},{"revision":"a9e9b0953b078cd40f5e19ef4face6fc","url":"pluginsSrc/katex/dist/fonts/KaTeX_Caligraphic-Bold.woff2"},{"revision":"de2ba279933d60f7819ff61f71c17bed","url":"pluginsSrc/katex/dist/fonts/KaTeX_Caligraphic-Bold.woff"},{"revision":"497bf407c4c609c6cf1f1ad38f437f7f","url":"pluginsSrc/katex/dist/fonts/KaTeX_Caligraphic-Bold.ttf"},{"revision":"66c678209ce93b6e2b583f02ce41529e","url":"pluginsSrc/katex/dist/fonts/KaTeX_AMS-Regular.woff2"},{"revision":"10824af77e9961cfd548c8a458f10851","url":"pluginsSrc/katex/dist/fonts/KaTeX_AMS-Regular.woff"},{"revision":"56573229753fad48910bda2ea1a6dd54","url":"pluginsSrc/katex/dist/fonts/KaTeX_AMS-Regular.ttf"},{"revision":"6be74da2bd31a1975da5090d5926cd54","url":"pluginsSrc/katex/dist/contrib/copy-tex.min.js"},{"revision":"ae11493d70a8ce9fa776cc7aec1be764","url":"pluginsSrc/instant.page/instantpage.js"},{"revision":"8a817782fe4a94b4d2499bcfce04f8c3","url":"pluginsSrc/gitalk/dist/gitalk.min.js"},{"revision":"8476031a633732dff9875feae0890070","url":"pluginsSrc/gitalk/dist/gitalk.css"},{"revision":"ef690ba60b284a6e4434fdfcc8a6272a","url":"pluginsSrc/disqusjs/dist/browser/disqusjs.es2015.umd.min.js"},{"revision":"8c991997bc8dfef3cacb9ee848fae764","url":"pluginsSrc/disqusjs/dist/browser/styles/disqusjs.css"},{"revision":"61095ed4dc231d385757e1295f41ad95","url":"pluginsSrc/chart.js/dist/chart.umd.js"},{"revision":"1b9c8fe18c6fd8438d3442efb18c4694","url":"pluginsSrc/butterfly-extsrc/sharejs/dist/js/social-share.min.js"},{"revision":"3871ed57ba207fd8432d3e029d5b45a5","url":"pluginsSrc/butterfly-extsrc/sharejs/dist/fonts/iconfont.woff2"},{"revision":"4ac164a6d6ff134e2600fa3a6d11e9f0","url":"pluginsSrc/butterfly-extsrc/sharejs/dist/fonts/iconfont.woff"},{"revision":"172f0a3556b752ca681d536279b73315","url":"pluginsSrc/butterfly-extsrc/sharejs/dist/fonts/iconfont.ttf"},{"revision":"5785a05fa891074972f95826d44175cc","url":"pluginsSrc/butterfly-extsrc/sharejs/dist/css/share.min.css"},{"revision":"7b5e05378aa5c4dbdccbe9a34cf30adb","url":"pluginsSrc/butterfly-extsrc/metingjs/dist/Meting.min.js"},{"revision":"30b2f5d43759302605d593c1b8b3c027","url":"pluginsSrc/butterfly-extsrc/dist/fireworks.min.js"},{"revision":"19aa40f9f44d5f568ad200be3909b2a0","url":"pluginsSrc/butterfly-extsrc/dist/click-show-text.min.js"},{"revision":"77369a5a3007bd7bec3ff51ae9c80f51","url":"pluginsSrc/butterfly-extsrc/dist/click-heart.min.js"},{"revision":"d22e1a843a3797c4023047018a269e94","url":"pluginsSrc/butterfly-extsrc/dist/canvas-ribbon.min.js"},{"revision":"f481421e648d310e785b04ec6cdb6fdf","url":"pluginsSrc/butterfly-extsrc/dist/canvas-nest.min.js"},{"revision":"67f8ae7130ba7e392b8c4206cc49f059","url":"pluginsSrc/butterfly-extsrc/dist/canvas-fluttering-ribbon.min.js"},{"revision":"19f8a70f31a9b9c54815c4398a6d614e","url":"pluginsSrc/butterfly-extsrc/dist/activate-power-mode.min.js"},{"revision":"2f577924085ebbe12e29f3ff706397d0","url":"pluginsSrc/blueimp-md5/js/md5.min.js"},{"revision":"0a63ba0c60354069bd5036a20ce1f8f0","url":"pluginsSrc/artalk/dist/Artalk.js"},{"revision":"a36b54260ba5c899bab763ff1949803f","url":"pluginsSrc/artalk/dist/Artalk.css"},{"revision":"8f1017e7a73737e631ff95fa51e4e7d7","url":"pluginsSrc/aplayer/dist/APlayer.min.js"},{"revision":"fbe994054426fadb2dff69d824c5c67a","url":"pluginsSrc/aplayer/dist/APlayer.min.css"},{"revision":"67a0fbe78a9329ad16324445a6d7cb50","url":"pluginsSrc/algoliasearch/dist/lite/builds/browser.umd.js"},{"revision":"3d887a9f3ad6d6d5eb9f08b1d72f4b5f","url":"pluginsSrc/abcjs/dist/abcjs-basic-min.js"},{"revision":"7f9d9fe44aefb541b005371e98e94324","url":"pluginsSrc/@waline/client/dist/waline.js"},{"revision":"e8a4534f899312ba553034fb1216546b","url":"pluginsSrc/@waline/client/dist/waline.css"},{"revision":"6b6b455b96ea52d70d69fb54e265803b","url":"pluginsSrc/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.woff2"},{"revision":"9209428ae208e223b94b9172802e97a7","url":"pluginsSrc/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2"},{"revision":"ce76b7aa92724e57c94982ffbbc9a4a1","url":"pluginsSrc/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2"},{"revision":"523f833a8b5bdd6079b88981425e31a7","url":"pluginsSrc/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2"},{"revision":"2a16261ad0706f6f7fbf4cb04e487611","url":"pluginsSrc/@fortawesome/fontawesome-free/css/all.min.css"},{"revision":"3c04b697824aee4ebe05a75509d2d591","url":"pluginsSrc/@fancyapps/ui/dist/fancybox/fancybox.umd.js"},{"revision":"d4e3df64d639d509cef61bbf4665d887","url":"pluginsSrc/@fancyapps/ui/dist/fancybox/fancybox.css"},{"revision":"1e4571560f743acd7070f9bd3c2bb679","url":"pluginsSrc/@egjs/infinitegrid/dist/infinitegrid.min.js"},{"revision":"7ee5a1792ec488061739666d84140fbe","url":"pluginsSrc/@docsearch/js/dist/umd/index.js"},{"revision":"fb7939e312d8861ceed093573b796d77","url":"pluginsSrc/@docsearch/css/dist/style.css"},{"revision":"cb004426c9bd62ba16e200b048462887","url":"lib/hbe.js"},{"revision":"2a0c775f99c73d7223a6a68631cdc883","url":"js/wow_init.js"},{"revision":"e84a69b53c7dd1ff5b6b330d9fb2044f","url":"js/utils.js"},{"revision":"c01d09126567452460ca80a4341f5f99","url":"js/tw_cn.js"},{"revision":"d2be0d8866877454674f3e102be652b4","url":"js/toggleSettingsModal.js"},{"revision":"0ed8ceab4ef20e5225c49a994242aad0","url":"js/toggleFontSize.js"},{"revision":"d2c813be41cdd9625fed2cc27a3e51d5","url":"js/toggleFont.js"},{"revision":"aaed2c6f3e83befaef1d94bbc574a6ae","url":"js/scroll-to-anchor.js"},{"revision":"fd772360f5695bc71719475c1dc6513d","url":"js/randomPost.js"},{"revision":"ef632184a8bdaec0d6e4e0383d368ee6","url":"js/pwa.js"},{"revision":"5dc36f8a93197abf09bd725cddd97921","url":"js/popup.js"},{"revision":"c1f20310307d33e41be3b787ef85e345","url":"js/pjaxAplayer.js"},{"revision":"f52073ee95c3f319e57532eac06f16ca","url":"js/Meting.min.js"},{"revision":"8284403085727620b481f046288fa3f7","url":"js/menus.js"},{"revision":"5e75560ff107c85cc9c3344b46bcb683","url":"js/main.js"},{"revision":"f6bb1034184b338ea022930d3d0229d4","url":"js/homepage.js"},{"revision":"745260d8561768ee1b6c9c4fe2c2d569","url":"js/head.js"},{"revision":"880968da5d5a7eb166c03531e8a4f6c5","url":"js/card-anthology.js"},{"revision":"af628b32f2b8b83143c8085c6ca2de3e","url":"js/cacheManager.js"},{"revision":"30ca434a40652c55cb7ca7cd4386f431","url":"js/app.js"},{"revision":"8f1017e7a73737e631ff95fa51e4e7d7","url":"js/APlayer.min.js"},{"revision":"53b093fc411e6861751450dc57f5c3c7","url":"js/search/local-search.js"},{"revision":"44848bf50caf33e4e9d1dbbf705ea5e2","url":"js/search/algolia.js"},{"revision":"49ed2faf014183ea3bf347500c0572c6","url":"js/posts_js/演示数据.js"},{"revision":"7fb02a820aed429dbc97514d6060757d","url":"js/posts_js/梯度下降线性回归.js"},{"revision":"19d879e90f9a232710099df29f43ec8c","url":"js/posts_js/梯度下降比较.js"},{"revision":"ba32016e0f95b3c6c0b020f170af2175","url":"js/posts_js/梯度下降图解.js"},{"revision":"ddaadb578049ccc6f3fd9361b1ff078a","url":"js/posts_js/最小二乘法成功.js"},{"revision":"5c2432396899fd45cea77d891a1d802c","url":"js/posts_js/最小二乘法.js"},{"revision":"e750a91e98ca4dfc37fe1c86e437c266","url":"js/posts_js/从0开始的机器学习·线性回归·最小二乘法.js"},{"revision":"ad79d8b5819819e15e5dd97089dba7a6","url":"js/posts_js/从0开始的机器学习·损失函数图.js"},{"revision":"a35b551055d75cdb4f3d7aeebfec16d8","url":"js/posts_js/从0开始的机器学习·什么是机器学习·线性回归通俗解释.js"},{"revision":"098aa4a7425a3b247eb3532a0d2b786e","url":"js/posts_js/从0开始的机器学习·二分类叉熵损失图.js"},{"revision":"21fe90eedcbaafb4ed529d78418d30bd","url":"js/mod/wow.min.js"},{"revision":"271138733214648bd35015f2e3186107","url":"js/mod/email.min.js"},{"revision":"d41d8cd98f00b204e9800998ecf8427e","url":"css/var.css"},{"revision":"61f4a6637d1fc3ac247d880fcbb3e0b6","url":"css/index.css"},{"revision":"f1245164f762ee83309fa797a63fb868","url":"css/hbe.style.css"},{"revision":"a4743cd2a7b80582470eb78532807357","url":"css/h.css"},{"revision":"a90e7f2688ce54ae4ffc27ff759ce422","url":"css/fonts.css"},{"revision":"6c70fb4be0dd330a0ab891330496193a","url":"css/custom.css"},{"revision":"6ce219f5556af48d61ce5fb6090020ce","url":"css/cache-panel.css"},{"revision":"fbe994054426fadb2dff69d824c5c67a","url":"css/APlayer.min.css"},{"revision":"c0be8e53226ac34833fd9b5dbc01ebc5","url":"css/animate.min.css"}]);
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