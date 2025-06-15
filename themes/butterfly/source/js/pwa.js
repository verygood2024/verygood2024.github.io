let deferredPrompt = null;

// 判断 iOS
function isIOS() {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

// 判断 Edge 浏览器（主要Windows平台）
function isEdge() {
  return navigator.userAgent.toLowerCase().includes('edg');
}

// 判断移动设备或平板
function isMobileOrTablet() {
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|windows phone|mobile|tablet/.test(ua);
}

// 判断是否独立窗口（PWA 已安装且以独立窗口打开）
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// 使用 getInstalledRelatedApps API 判断是否安装相关应用（仅Chrome/Edge支持）
async function checkRelatedApps() {
  if (!('getInstalledRelatedApps' in navigator)) return false;
  try {
    const relatedApps = await navigator.getInstalledRelatedApps();
    return relatedApps.length > 0;
  } catch (e) {
    console.warn('getInstalledRelatedApps 调用失败:', e);
    return false;
  }
}

// 核心：精准判断PWA是否已安装
async function isPWAInstalled() {
  if (isInStandaloneMode()) return true;                // 独立窗口
  if (isIOS() && window.navigator.standalone === true) return true; // iOS
  if (await checkRelatedApps()) return true;            // Chrome/Edge相关应用安装
  return false;
}

// 安装 Edge 浏览器提示，在 DOM 加载完立即隐藏
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('browserChoiceModal');
  const modalContent = modal.querySelector('.modal-content');
  modal.classList.add('modal-hidden');
  modalContent.classList.add('modal-hidden');
});

// 显示模态窗口
function promptInstallEdge() {
  const modal = document.getElementById('browserChoiceModal');
  const modalContent = modal.querySelector('.modal-content');
  modal.classList.remove('modal-hidden');
  modalContent.classList.remove('modal-hidden');

  // 给按钮绑定事件（每次调用都重新绑定，避免 PJAX 丢失）
  document.getElementById('installEdgeBtn').onclick = () => {
    window.open('https://www.microsoft.com/edge', '_blank');
    modal.classList.add('modal-hidden');
    modalContent.classList.add('modal-hidden');
  };

  document.getElementById('installChromeBtn').onclick = () => {
    window.open('https://www.google.com/chrome/', '_blank');
    modal.classList.add('modal-hidden');
    modalContent.classList.add('modal-hidden');
  };

  document.getElementById('closeModalBtn').onclick = () => {
    modal.classList.add('modal-hidden');
    modalContent.classList.add('modal-hidden');
  };
}

// 监听 PJAX 完成事件，重新绑定按钮
document.addEventListener('pjax:complete', () => {
  promptInstallEdge();
});


// 弹出安装提示
function handleInstallPrompt() {
  if (!deferredPrompt) return alert('安装提示尚未准备好，请稍后再试。');
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('✅ 用户接受安装');
      sessionStorage.setItem('pwaInstalled', 'true');
    } else {
      console.log('❌ 用户取消安装');
    }
    deferredPrompt = null;
    updateInstallStatus();
  });
}

// 更新安装提示 UI 状态
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

  // 未安装，展示安装按钮（仅移动设备显示Banner）
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

// 绑定安装按钮行为
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

// 监听 beforeinstallprompt 事件
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📦 捕获 beforeinstallprompt');
  e.preventDefault();
  deferredPrompt = e;
  updateInstallStatus();
});

// 监听安装完成事件
window.addEventListener('appinstalled', () => {
  console.log('✅ 安装完成');
  deferredPrompt = null;
  sessionStorage.setItem('pwaInstalled', 'true');
  updateInstallStatus();
});

// 页面可见时重新检测
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    updateInstallStatus();
  }
});

// 页面加载完成初始化
window.addEventListener('DOMContentLoaded', () => {
  updateInstallStatus();
  setupInstallButtons();
});

// Butterfly 主题 PJAX 完成后重新初始化
document.addEventListener('pjax:complete', () => {
  updateInstallStatus();
  setupInstallButtons();
});
