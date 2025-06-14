let deferredPrompt = null;

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
      }
      deferredPrompt = null;
      const banner = document.getElementById('pwaInstallBanner');
      if (banner) banner.style.display = 'none';
    });
  }
}

// 主按钮和辅助按钮设置
function setupInstallButtons() {
  const installBtn = document.getElementById('installPWA');           // 辅助按钮
  const altBtn = document.getElementById('pwa-install-btn');          // 始终显示的主按钮
  const confirmBtn = document.getElementById('pwaInstallConfirm');    // 横幅确认按钮
  const dismissBtn = document.getElementById('pwaInstallDismiss');    // 横幅关闭按钮
  const banner = document.getElementById('pwaInstallBanner');

  // 初始化隐藏
  if (installBtn) installBtn.style.display = 'none';
  if (banner) banner.style.display = 'none';

  // 辅助按钮（通常用于提示 iOS）
  if (installBtn) {
    if (isInStandaloneMode() || isIOS()) {
      installBtn.style.display = 'inline-block';
      installBtn.title = isIOS()
        ? '请点击 Safari 底部的分享按钮 → “添加到主屏幕”'
        : '应用已安装';
      installBtn.addEventListener('click', () => {
        alert(isIOS()
          ? '请点击 Safari 浏览器底部的“分享”图标，然后选择“添加到主屏幕”。'
          : '您已安装本站应用到主屏幕 🎉');
      });
    } else {
      installBtn.style.display = 'inline-block';
      installBtn.title = '安装此应用';
      installBtn.addEventListener('click', handleInstallPrompt);
    }
  }

  // 主按钮
  if (altBtn) {
    altBtn.addEventListener('click', () => {
      if (isInStandaloneMode()) {
        alert('您已经安装过此应用 🎉');
      } else if (deferredPrompt) {
        handleInstallPrompt();
      } else {
        alert('安装提示尚未准备好，请稍后再试。');
      }
    });
  }

  // 横幅按钮：确认
  if (confirmBtn) {
    confirmBtn.addEventListener('click', handleInstallPrompt);
  }

  // 横幅按钮：关闭
  if (dismissBtn && banner) {
    dismissBtn.addEventListener('click', () => {
      banner.style.display = 'none';
    });
  }
}

// 监听 PWA 安装事件
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('捕获到 beforeinstallprompt 事件');
  e.preventDefault();

  // 如果已安装，直接返回
  if (isInStandaloneMode()) {
    console.log('已处于 PWA 独立模式，不显示安装提示');
    return;
  }

  deferredPrompt = e;

  const installBtn = document.getElementById('installPWA');
  if (installBtn) installBtn.style.display = 'inline-block';

  showBanner(); // 显示横幅（仅在需要时）
});

// 初始化入口
window.addEventListener('DOMContentLoaded', () => {
  setupInstallButtons();
});
