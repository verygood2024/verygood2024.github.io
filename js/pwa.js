let deferredPrompt = null;

// 判断 iOS
function isIOS() {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
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

// 判断是否已安装 PWA
async function isPWAInstalled() {
  if (isInStandaloneMode()) return true;
  if (isIOS() && window.navigator.standalone === true) return true;
  if (sessionStorage.getItem('pwaInstalled') === 'true') return true;
  if (await checkRelatedApps()) return true;
  return false;
}


// 是否支持 PWA 安装提示
function isPWAInstallSupported() {
  return 'onbeforeinstallprompt' in window;
}

// 是否支持 getInstalledRelatedApps API
function isRelatedAppsSupported() {
  return 'getInstalledRelatedApps' in navigator;
}

// 是否应该提示更换浏览器（iOS 除外，只要任一 API 不支持）
async function shouldPromptBrowserChoice() {
  if (isIOS()) return false;
  return !(isPWAInstallSupported() && isRelatedAppsSupported());
}

// 绑定模态窗口事件
function bindModalEvents() {
  const modal = document.getElementById('browserChoiceModal');
  const modalContent = modal.querySelector('.modal-content');

  document.getElementById('installEdgeBtn').onclick = () => {
    window.open('https://www.microsoft.com/edge', '_blank');
  };
  document.getElementById('installChromeBtn').onclick = () => {
    window.open('https://www.google.com/chrome/', '_blank');
  };
  document.getElementById('closeModalBtn').onclick = () => {
    closeModal(modal, modalContent);
  };
}

// 显示安装提示模态窗口
function promptInstallEdge() {
  const modal = document.getElementById('browserChoiceModal');
  const modalContent = modal.querySelector('.modal-content');

  modal.style.display = 'flex';
  modalContent.style.display = 'flex';

  modalContent.classList.remove('hide-animation');
  modalContent.classList.add('show-animation');

  bindModalEvents();
}


// 通用关闭模态函数
function closeModal(modal, modalContent) {
  modalContent.classList.remove('show-animation');
  modalContent.classList.add('hide-animation');

  modalContent.addEventListener('animationend', () => {
    modal.style.display = 'none';
    modalContent.style.display = 'none';
    modalContent.classList.remove('hide-animation');
  }, { once: true });
}


// 弹出安装提示
function handleInstallPrompt() {
  if (!deferredPrompt) return btf.snackbarShow("安装尚未准备好或已完成，请稍后再试。");
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

// 更新安装提示状态（按钮状态）
async function updateInstallStatus() {
  const banner = document.getElementById('pwaInstallBanner');
  const installBtn = document.getElementById('installPWA');
  const altBtn = document.getElementById('pwa-install-btn');

  const installed = await isPWAInstalled() || sessionStorage.getItem('pwaInstalled') === 'true';

  if (installed) {
    if (banner) animateBannerHide(banner);
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.title = '已安装本站应用';
      installBtn.onclick = () => btf.snackbarShow(`您已安装本站应用`);
    }
    if (altBtn) {
      altBtn.onclick = () => btf.snackbarShow(`您已安装本站应用`);
    }
    return;
  }

  const shouldPrompt = await shouldPromptBrowserChoice();

  if (banner) {
    const dismissedUntil = parseInt(localStorage.getItem('pwaBannerDismissedUntil'), 10);
    const now = Date.now();
    const isDismissed = dismissedUntil && now < dismissedUntil;
    if (isMobileOrTablet() && !isDismissed) {
      banner.classList.remove('hide');
      banner.style.display = 'flex';
    } else {
      animateBannerHide(banner);
    }
  }

  if (installBtn) {
    installBtn.style.display = 'inline-block';
    installBtn.onclick = async () => {
      if (shouldPrompt) return promptInstallEdge();
      if (!deferredPrompt) return btf.snackbarShow("安装尚未准备好或已完成，请稍后再试。");
      handleInstallPrompt();
    };
  }

  if (altBtn) {
    altBtn.onclick = async () => {
      if (shouldPrompt) return promptInstallEdge();
      if (!deferredPrompt) return btf.snackbarShow("安装尚未准备好或已完成，请稍后再试。");
      handleInstallPrompt();
    };
  }
}

// 绑定 banner 按钮行为
function setupInstallButtons() {
  const confirmBtn = document.getElementById('pwaInstallConfirm');
  const dismissBtn = document.getElementById('pwaInstallDismiss');
  const banner = document.getElementById('pwaInstallBanner');

  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      if (await shouldPromptBrowserChoice()) return promptInstallEdge();
      if (!deferredPrompt) return btf.snackbarShow("安装尚未准备好或已完成，请稍后再试。");
      handleInstallPrompt();
    };
  }

  if (dismissBtn && banner) {
    dismissBtn.onclick = () => {
      animateBannerHide(banner);
      const dismissUntil = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3天
      localStorage.setItem('pwaBannerDismissedUntil', dismissUntil.toString());
      btf.snackbarShow('已忽略安装提示，3天内将不再显示。');
      setTimeout(() => {btf.snackbarShow('我们还是建议您安装 PWA 以获得更好的体验。');},3000);
    };
  }
}

// 动画隐藏横幅
function animateBannerHide(banner) {
  banner.classList.add('hide');
  banner.addEventListener('transitionend', () => {
    banner.style.display = 'none';
  }, { once: true });
}

// 页面初始化时隐藏模态
window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('browserChoiceModal');
  const modalContent = modal?.querySelector('.modal-content');
  if (modal) modal.style.display = 'none';
  if (modalContent) modalContent.style.display = 'none';

  updateInstallStatus();
  setupInstallButtons();
});

// 捕获 beforeinstallprompt 事件
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📦 捕获 beforeinstallprompt');
  e.preventDefault();
  deferredPrompt = e;
  updateInstallStatus();
});

// 安装完成事件
window.addEventListener('appinstalled', () => {
  console.log('✅ 安装完成');
  deferredPrompt = null;
  sessionStorage.setItem('pwaInstalled', 'true');
  updateInstallStatus();
});

// 页面返回可见时重新检测
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    updateInstallStatus();
  }
});

// PJAX 加载完成后重新绑定
document.addEventListener('pjax:complete', () => {
  updateInstallStatus();
  setupInstallButtons();
});
