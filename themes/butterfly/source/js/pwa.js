let deferredPrompt = null;

// 判断是否为 iOS
function isIOS() {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

// 判断是否为移动设备或平板
function isMobileOrTablet() {
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|windows phone|mobile|tablet/.test(ua);
}

// 判断是否为 Edge 浏览器
function isEdge() {
  return navigator.userAgent.toLowerCase().includes('edg');
}

// 判断是否在独立窗口（PWA 模式）
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// 本地缓存安装状态
function isInstalledCached() {
  return localStorage.getItem('pwaInstalled') === 'true';
}
function setInstalledCached(value) {
  localStorage.setItem('pwaInstalled', value ? 'true' : 'false');
}

// 显示 Edge 下载提示
function promptInstallEdge() {
  alert('您的浏览器不支持安装本站应用。\n请使用 Microsoft Edge 浏览器访问本站以安装应用。');
  window.open('https://www.microsoft.com/edge', '_blank');
}

// 统一更新安装状态和 UI
function updateInstallStatus() {
  const banner = document.getElementById('pwaInstallBanner');
  const installBtn = document.getElementById('installPWA');
  const altBtn = document.getElementById('pwa-install-btn');

  const installed = isInStandaloneMode() || isIOS() || isInstalledCached();

  if (installed) {
    setInstalledCached(true);
    if (banner) banner.style.display = 'none';
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.title = '您已安装本站应用';
      installBtn.onclick = () => alert('您已安装本站应用 🎉');
    }
    if (altBtn) {
      altBtn.onclick = () => alert('您已安装本站应用 🎉');
    }
    deferredPrompt = null;
  } else {
    if (banner) banner.style.display = isMobileOrTablet() ? 'flex' : 'none';
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.title = '';
      installBtn.onclick = () => {
        if (isInStandaloneMode() || isInstalledCached()) {
          alert('您已安装本站应用 🎉');
          return;
        }
        if (!isEdge()) {
          promptInstallEdge();
        } else {
          handleInstallPrompt();
        }
      };
    }
    if (altBtn) {
      altBtn.onclick = () => {
        if (isInStandaloneMode() || isInstalledCached()) {
          alert('您已安装本站应用 🎉');
        } else if (!isEdge()) {
          promptInstallEdge();
        } else if (deferredPrompt) {
          handleInstallPrompt();
        } else {
          alert('安装提示尚未准备好，请稍后再试。');
        }
      };
    }
  }
}

// 安装事件处理
function handleInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'accepted') {
        console.log('用户接受安装');
        setInstalledCached(true);
      } else {
        console.log('用户取消安装');
        alert('您取消了安装');
      }
      deferredPrompt = null;
      const banner = document.getElementById('pwaInstallBanner');
      if (banner) banner.style.display = 'none';
      updateInstallStatus();
    });
  } else {
    promptInstallEdge();
  }
}

// 初始化按钮绑定
function setupInstallButtons() {
  const installBtn = document.getElementById('installPWA');
  const altBtn = document.getElementById('pwa-install-btn');
  const confirmBtn = document.getElementById('pwaInstallConfirm');
  const dismissBtn = document.getElementById('pwaInstallDismiss');
  const banner = document.getElementById('pwaInstallBanner');

  if (installBtn) installBtn.style.display = 'none';
  if (banner) banner.style.display = 'none';

  if (isInStandaloneMode() || isIOS()) {
    setInstalledCached(true);
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.title = isIOS()
        ? '请点击 Safari 底部的分享按钮 → “添加到主屏幕”'
        : '应用已安装';
      installBtn.onclick = () => {
        alert(isIOS()
          ? '请点击 Safari 浏览器底部的“分享”图标，然后选择“添加到主屏幕”。'
          : '您已安装本站应用 🎉');
      };
    }
  } else {
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.onclick = () => {
        if (isInStandaloneMode() || isInstalledCached()) {
          alert('您已安装本站应用 🎉');
        } else if (!isEdge()) {
          promptInstallEdge();
        } else if (deferredPrompt) {
          handleInstallPrompt();
        } else {
          alert('安装提示尚未准备好，请稍后再试。');
        }
      };
    }
  }

  if (altBtn) {
    altBtn.onclick = () => {
      if (isInStandaloneMode() || isInstalledCached()) {
        alert('您已安装本站应用 🎉');
      } else if (!isEdge()) {
        promptInstallEdge();
      } else if (deferredPrompt) {
        handleInstallPrompt();
      } else {
        alert('安装提示尚未准备好，请稍后再试。');
      }
    };
  }

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (isInStandaloneMode() || isInstalledCached()) {
        alert('您已安装本站应用 🎉');
      } else if (!isEdge()) {
        promptInstallEdge();
      } else if (deferredPrompt) {
        handleInstallPrompt();
      } else {
        alert('安装提示尚未准备好，请稍后再试。');
      }
    };
  }

  if (dismissBtn && banner) {
    dismissBtn.onclick = () => {
      banner.style.display = 'none';
    };
  }
}

// 捕获 beforeinstallprompt 事件
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('捕获到 beforeinstallprompt 事件');
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('installPWA');
  const banner = document.getElementById('pwaInstallBanner');

  if (installBtn) installBtn.style.display = 'inline-block';
  if (banner && isMobileOrTablet()) banner.style.display = 'flex';
});

// 捕获 appinstalled 事件
window.addEventListener('appinstalled', () => {
  console.log('PWA 安装成功');
  deferredPrompt = null;
  setInstalledCached(true);
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) banner.style.display = 'none';
  updateInstallStatus();
});

// 切换回页面时重新检测安装状态
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    updateInstallStatus();
  }
});

// ✅ 整合初始化逻辑（用于 PJAX & 首次加载）
function initPWAInstall() {
  setupInstallButtons();
  updateInstallStatus();
}

// ✅ 初始加载执行一次
window.addEventListener('DOMContentLoaded', () => {
  initPWAInstall();
});

// ✅ 兼容 Butterfly PJAX 页面切换
document.addEventListener('pjax:complete', () => {
  initPWAInstall();
});
