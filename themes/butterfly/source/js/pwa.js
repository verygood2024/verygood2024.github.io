let deferredPrompt = null;

// 判断 iOS
function isIOS() {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

// 判断是否为 Edge
function isEdge() {
  return navigator.userAgent.toLowerCase().includes('edg');
}

// 判断是否为移动设备或平板
function isMobileOrTablet() {
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|windows phone|mobile|tablet/.test(ua);
}

// 判断是否为独立窗口模式
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// 精确判断是否已安装 PWA
async function isPWAInstalled() {
  if (isInStandaloneMode()) return true;
  if (isIOS()) return window.navigator.standalone === true;

  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      if (reg.scope === window.location.origin + '/') return true;
    }
  }
  return false;
}

// 安装 Edge 提示
function promptInstallEdge() {
  alert('请使用 Microsoft Edge 浏览器访问本站以安装应用。');
  window.open('https://www.microsoft.com/edge', '_blank');
}

// 安装提示触发逻辑
function handleInstallPrompt() {
  if (!deferredPrompt) return alert('安装提示尚未准备好，请稍后再试。');
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((result) => {
    if (result.outcome === 'accepted') {
      console.log('✅ 用户接受安装');
      sessionStorage.setItem('pwaInstalled', 'true');
    } else {
      console.log('❌ 用户取消安装');
    }
    deferredPrompt = null;
    updateInstallStatus();
  });
}

// 更新安装提示状态（核心函数）
async function updateInstallStatus() {
  const banner = document.getElementById('pwaInstallBanner');
  const installBtn = document.getElementById('installPWA');
  const altBtn = document.getElementById('pwa-install-btn');

  const installed = await isPWAInstalled() || sessionStorage.getItem('pwaInstalled') === 'true';

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
    return;
  }

  // 未安装，展示按钮
  if (banner) banner.style.display = isMobileOrTablet() ? 'flex' : 'none';
  if (installBtn) {
    installBtn.style.display = 'inline-block';
    installBtn.onclick = () => {
      if (!isEdge()) return promptInstallEdge();
      if (!deferredPrompt) return alert('安装提示尚未准备好，请稍后再试。');
      handleInstallPrompt();
    };
  }
  if (altBtn) {
    altBtn.onclick = () => {
      if (!isEdge()) return promptInstallEdge();
      if (!deferredPrompt) return alert('安装提示尚未准备好，请稍后再试。');
      handleInstallPrompt();
    };
  }
}

// 绑定按钮行为
function setupInstallButtons() {
  const confirmBtn = document.getElementById('pwaInstallConfirm');
  const dismissBtn = document.getElementById('pwaInstallDismiss');
  const banner = document.getElementById('pwaInstallBanner');

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (!isEdge()) return promptInstallEdge();
      if (!deferredPrompt) return alert('安装提示尚未准备好，请稍后再试。');
      handleInstallPrompt();
    };
  }

  if (dismissBtn && banner) {
    dismissBtn.onclick = () => {
      banner.style.display = 'none';
    };
  }
}

// 捕获 beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📦 捕获 beforeinstallprompt');
  e.preventDefault();
  deferredPrompt = e;
  updateInstallStatus();
});

// 捕获安装成功事件
window.addEventListener('appinstalled', () => {
  console.log('✅ 安装完成');
  deferredPrompt = null;
  sessionStorage.setItem('pwaInstalled', 'true');
  updateInstallStatus();
});

// 可见性变化时重新检测（例如从后台切回）
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    updateInstallStatus();
  }
});

// 页面加载完成
window.addEventListener('DOMContentLoaded', () => {
  updateInstallStatus();
  setupInstallButtons();
});

// PJAX 支持：Butterfly 专用
document.addEventListener('pjax:complete', () => {
  updateInstallStatus();
  setupInstallButtons();
});
