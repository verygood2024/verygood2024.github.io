let deferredPrompt = null;
let promptFired = false; // 标记是否捕获到了 PWA 安装事件

// 判断是否为 Android 且浏览器不支持 PWA 安装
function isAndroidUnsupportedPWA() {
  const ua = navigator.userAgent.toLowerCase();
  return /android/.test(ua) && !promptFired && !isIOS() && !isInStandaloneMode();
}

// 引导下载 Edge 浏览器
function promptToDownloadEdge() {
  const downloadUrl = 'https://www.microsoft.com/zh-cn/edge/mobile?form=MT00OS&cs=1512273688';
  const userConfirmed = confirm('当前浏览器可能不支持安装本站 App。\n推荐使用 Microsoft Edge 浏览器进行安装。\n是否前往下载？');
  if (userConfirmed) {
    window.open(downloadUrl, '_blank');
  }
}

// 判断是否为 iOS
function isIOS() {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

// 判断是否已安装为 PWA
function isInStandaloneMode() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
         (window.navigator.standalone === true) ||
         document.referrer.startsWith('android-app://');
}

// 判断是否为移动端或平板
function isMobileOrTablet() {
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|windows phone|mobile|tablet/.test(ua);
}

// 是否应该显示横幅
function shouldShowInstallBanner() {
  return !isInStandaloneMode() && isMobileOrTablet() && deferredPrompt;
}

// 显示横幅
function showBanner() {
  const banner = document.getElementById('pwaInstallBanner');
  if (banner && shouldShowInstallBanner()) {
    banner.style.display = 'flex';
  }
}

// 安装触发逻辑
function handleInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'accepted') {
        console.log('用户接受安装');
      } else {
        console.log('用户取消安装');
        if (isAndroidUnsupportedPWA()) {
          promptToDownloadEdge();
        }
      }
      deferredPrompt = null;
      const banner = document.getElementById('pwaInstallBanner');
      if (banner) banner.style.display = 'none';
    });
  } else if (isAndroidUnsupportedPWA()) {
    promptToDownloadEdge();
  }
}

// 主按钮和辅助按钮设置
function setupInstallButtons() {
  const installBtn = document.getElementById('installPWA');           // 辅助按钮
  const altBtn = document.getElementById('pwa-install-btn');          // 始终显示的主按钮
  const confirmBtn = document.getElementById('pwaInstallConfirm');    // 横幅确认按钮
  const dismissBtn = document.getElementById('pwaInstallDismiss');    // 横幅关闭按钮
  const banner = document.getElementById('pwaInstallBanner');

  if (installBtn) installBtn.style.display = 'none';
  if (banner) banner.style.display = 'none';

  if (installBtn) {
    if (isInStandaloneMode() || isIOS()) {
      installBtn.style.display = 'inline-block';
      installBtn.title = isIOS()
        ? '请点击 Safari 底部的分享按钮 → “添加到主屏幕”'
        : '应用已安装';
      installBtn.addEventListener('click', () => {
        alert(isIOS()
          ? '请点击 Safari 浏览器底部的“分享”图标，然后选择“添加到主屏幕”。'
          : '您已安装本站应用 🎉');
      });
    } else {
      installBtn.style.display = 'inline-block';
      installBtn.title = '安装此应用';
      installBtn.addEventListener('click', handleInstallPrompt);
    }
  }

  if (altBtn) {
    altBtn.addEventListener('click', () => {
      if (isInStandaloneMode()) {
        alert('您已经安装过此应用 🎉');
      } else {
        handleInstallPrompt();
      }
    });
  }

  if (confirmBtn) confirmBtn.addEventListener('click', handleInstallPrompt);
  if (dismissBtn && banner) {
    dismissBtn.addEventListener('click', () => {
      banner.style.display = 'none';
    });
  }
}

// 捕获安装事件
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('捕获到 beforeinstallprompt');
  e.preventDefault();
  promptFired = true;
  deferredPrompt = e;

  const installBtn = document.getElementById('installPWA');
  if (installBtn) installBtn.style.display = 'inline-block';
  showBanner();
});

// 启动
window.addEventListener('DOMContentLoaded', () => {
  setupInstallButtons();

  // 在加载后若是 Android 且不支持 PWA，提示下载 Edge
  setTimeout(() => {
    if (isAndroidUnsupportedPWA()) {
      console.log('当前 Android 浏览器不支持 PWA，提示下载 Edge');
      promptToDownloadEdge();
    }
  }, 3000); // 延迟一段时间防止误判
});
