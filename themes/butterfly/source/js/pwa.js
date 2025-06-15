let deferredPrompt = null;

// 判断是否为 iOS
function isIOS() {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

// 判断是否为 Microsoft Edge
function isEdge() {
  return navigator.userAgent.toLowerCase().includes('edg');
}

// 判断是否为移动设备或平板
function isMobileOrTablet() {
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|windows phone|mobile|tablet/.test(ua);
}

// 判断是否为独立窗口运行（即 PWA 模式）
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// 精准判断是否已经安装 PWA
async function isPWAInstalled() {
  if (isInStandaloneMode()) return true;
  if (isIOS()) return window.navigator.standalone === true;

  // getInstalledRelatedApps 仅支持部分浏览器，需兜底逻辑
  if ('getInstalledRelatedApps' in navigator) {
    const related = await navigator.getInstalledRelatedApps();
    if (related.length > 0) return true;
  }

  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      if (reg.active && reg.scope.startsWith(location.origin)) return true;
    }
  }

  return false;
}

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


// 用户点击安装按钮时触发的函数
function handleInstallPrompt() {
  if (!deferredPrompt) return alert('安装提示尚未准备好，请稍后再试。');
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((result) => {
    if (result.outcome === 'accepted') {
      console.log('✅ 用户接受安装');
    } else {
      console.log('❌ 用户取消安装');
    }
    deferredPrompt = null;
    updateInstallStatus();
  });
}

// 更新按钮与横幅显示状态
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
      altBtn.style.display = 'inline-block';
      altBtn.onclick = () => alert('🎉 您已安装本站应用');
    }
    return;
  }

  // 未安装：显示安装提示按钮（仅移动端显示横幅）
  if (banner) banner.style.display = isMobileOrTablet() ? 'flex' : 'none';

  const bindInstall = (el) => {
    if (!el) return;
    el.style.display = 'inline-block';
    el.onclick = () => {
      if (!isEdge()) return promptInstallEdge();
      handleInstallPrompt();
    };
  };

  bindInstall(installBtn);
  bindInstall(altBtn);
}

// 绑定横幅内确认和关闭按钮事件
function setupInstallButtons() {
  const confirmBtn = document.getElementById('pwaInstallConfirm');
  const dismissBtn = document.getElementById('pwaInstallDismiss');
  const banner = document.getElementById('pwaInstallBanner');

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (!isEdge()) return promptInstallEdge();
      handleInstallPrompt();
    };
  }

  if (dismissBtn && banner) {
    dismissBtn.onclick = () => {
      banner.style.display = 'none';
    };
  }
}

// 捕获浏览器触发的安装提示事件（只触发一次）
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📦 捕获 beforeinstallprompt');
  e.preventDefault();
  deferredPrompt = e;
  updateInstallStatus(); // 捕获后可展示按钮
});

// 监听 PWA 安装完成事件
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA 安装完成');
  deferredPrompt = null;
  updateInstallStatus(); // 安装完成后立即隐藏提示
});

// 当用户返回当前标签页时重新判断状态（例如卸载了 App）
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    updateInstallStatus();
  }
});

// 页面初次加载
window.addEventListener('DOMContentLoaded', () => {
  updateInstallStatus();
  setupInstallButtons();
});

// PJAX 页面切换完成后重新绑定（Butterfly 主题）
document.addEventListener('pjax:complete', () => {
  updateInstallStatus();
  setupInstallButtons();
});
