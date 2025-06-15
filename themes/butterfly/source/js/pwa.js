let deferredPrompt = null;

// 判断 iOS
function isIOS() {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

// 判断是否 Edge 浏览器
function isEdge() {
  return navigator.userAgent.toLowerCase().includes('edg');
}

// 判断是否移动设备或平板
function isMobileOrTablet() {
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|windows phone|mobile|tablet/.test(ua);
}

// 判断是否独立窗口（PWA启动）
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// 使用 getInstalledRelatedApps 检测是否安装了相关应用（Chrome/Edge支持）
async function checkRelatedApps() {
  if (!navigator.getInstalledRelatedApps) return false;
  try {
    const relatedApps = await navigator.getInstalledRelatedApps();
    // 如果相关应用列表中有匹配本站的，则返回true
    return relatedApps.some(app => {
      // 你可以根据需要增加更严格的判断，例如app.id, app.platform等
      return app.url && app.url.startsWith(window.location.origin);
    });
  } catch (e) {
    console.warn('getInstalledRelatedApps检测异常:', e);
    return false;
  }
}

// Service Worker注册检测
async function checkServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) return false;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    // 精确匹配当前页面scope（含/结尾）
    const originScope = window.location.origin + '/';
    return regs.some(reg => reg.scope === originScope);
  } catch (e) {
    console.warn('ServiceWorker注册检测异常:', e);
    return false;
  }
}

// 核心检测函数
async function isPWAInstalled() {
  // 1. 先判断是否独立窗口
  if (isInStandaloneMode()) return true;

  // 2. iOS特例
  if (isIOS()) {
    // iOS的window.navigator.standalone 是boolean，代表是否独立运行
    return window.navigator.standalone === true;
  }

  // 3. 使用 getInstalledRelatedApps
  if (await checkRelatedApps()) return true;

  // 4. 结合 Service Worker 注册检测
  if (await checkServiceWorkerRegistration()) return true;

  // 5. 如果以上都不成立，认为未安装
  return false;
}

// Edge浏览器提示
// 引导用户使用 Edge 浏览器
function promptInstallEdge() {
  const modal = document.getElementById('browserChoiceModal');
  modal.classList.remove('modal-hidden');

  document.getElementById('installEdgeBtn').onclick = () => {
    window.open('https://www.microsoft.com/edge', '_blank');
    modal.classList.add('modal-hidden');
  };
  document.getElementById('installChromeBtn').onclick = () => {
    window.open('https://www.google.com/chrome/', '_blank');
    modal.classList.add('modal-hidden');
  };
  document.getElementById('closeModalBtn').onclick = () => {
    modal.classList.add('modal-hidden');
  };
}

// 触发安装弹窗
function handleInstallPrompt() {
  if (!deferredPrompt) {
    alert('安装提示尚未准备好，请稍后再试。');
    return;
  }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(result => {
    if (result.outcome === 'accepted') {
      console.log('用户接受安装');
    } else {
      console.log('用户取消安装');
    }
    deferredPrompt = null;
    updateInstallStatus();
  });
}

// 更新UI状态，完全根据实时检测结果显示/隐藏
async function updateInstallStatus() {
  const banner = document.getElementById('pwaInstallBanner');
  const installBtn = document.getElementById('installPWA');
  const altBtn = document.getElementById('pwa-install-btn');

  const installed = await isPWAInstalled();

  if (installed) {
    if (banner) banner.style.display = 'none';
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.title = '已安装本站应用';
      installBtn.onclick = () => alert('🎉 您已安装本站应用');
    }
    if (altBtn) {
      altBtn.onclick = () => alert('🎉 您已安装本站应用');
    }
  } else {
    if (banner) banner.style.display = isMobileOrTablet() ? 'flex' : 'none';
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.title = '';
      installBtn.onclick = () => {
        if (!isEdge()) {
          promptInstallEdge();
          return;
        }
        if (!deferredPrompt) {
          alert('安装提示尚未准备好，请稍后再试。');
          return;
        }
        handleInstallPrompt();
      };
    }
    if (altBtn) {
      altBtn.onclick = installBtn.onclick;
    }
  }
}

// 绑定按钮事件
function setupInstallButtons() {
  const confirmBtn = document.getElementById('pwaInstallConfirm');
  const dismissBtn = document.getElementById('pwaInstallDismiss');
  const banner = document.getElementById('pwaInstallBanner');

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (!isEdge()) {
        promptInstallEdge();
        return;
      }
      if (!deferredPrompt) {
        alert('安装提示尚未准备好，请稍后再试。');
        return;
      }
      handleInstallPrompt();
    };
  }

  if (dismissBtn && banner) {
    dismissBtn.onclick = () => {
      banner.style.display = 'none';
    };
  }
}

// 捕获 beforeinstallprompt，阻止默认弹窗，保存事件
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  updateInstallStatus();
});

// 监听安装完成事件
window.addEventListener('appinstalled', () => {
  console.log('PWA 安装完成');
  deferredPrompt = null;
  updateInstallStatus();
});

// 页面可见性变化时重新检测
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    updateInstallStatus();
  }
});

// 页面加载完毕初始化
window.addEventListener('DOMContentLoaded', () => {
  updateInstallStatus();
  setupInstallButtons();
});

// PJAX页面局部刷新（Butterfly专用）
document.addEventListener('pjax:complete', () => {
  updateInstallStatus();
  setupInstallButtons();
});
