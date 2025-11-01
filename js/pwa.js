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

/* ---------------------------
   模态窗口控制部分
--------------------------- */

// 绑定模态窗口事件（兼容 iOS 与通用版本）
function bindModalEvents() {
  const modalDesktop = document.getElementById('browserChoiceModal');
  const modalIOS = document.getElementById('browserChoiceModal-IOS');
  const modal = isIOS() ? modalIOS : modalDesktop;

  if (!modal) return;
  const modalContent = modal.querySelector('.modal-content');

  const installEdgeBtn = modal.querySelector('#installEdgeBtn');
  const installChromeBtn = modal.querySelector('#installChromeBtn');
  const closeModalBtn = modal.querySelector('#closeModalBtn');

  if (installEdgeBtn) installEdgeBtn.onclick = () => window.open('https://www.microsoft.com/edge', '_blank');
  if (installChromeBtn) installChromeBtn.onclick = () => window.open('https://www.google.com/chrome/', '_blank');
  if (closeModalBtn) closeModalBtn.onclick = () => closeModal(modal, modalContent);
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

  openSettingsModal();
  handleNavAndRightside({ hideNav: false, hideRightside: false, hidePwa: false });
}

// 显示安装提示模态窗口（自动区分 iOS 与其他平台）
function promptInstallEdge() {
  handleNavAndRightside({ hideNav: true, hideRightside: true, hidePwa: true });
  closeSettingsModal();

  const modal = isIOS()
    ? document.getElementById('browserChoiceModal-IOS')
    : document.getElementById('browserChoiceModal');

  if (!modal) return;

  const modalContent = modal.querySelector('.modal-content');
  modal.style.display = 'flex';
  modalContent.style.display = 'flex';

  modalContent.classList.remove('hide-animation');
  modalContent.classList.add('show-animation');

  bindModalEvents();
}

/* ---------------------------
   设置窗口控制部分
--------------------------- */

function closeSettingsModal() {
  const settingsModal = document.getElementById('settingsModal');
  const settingsModalContent = settingsModal.querySelector('.modal-content');
  if (settingsModal.style.display === 'flex') {
    settingsModal.classList.add('modalFadeOut');
    settingsModalContent.classList.add('modalFadeOut');

    settingsModalContent.addEventListener('animationend', () => {
      settingsModal.style.display = 'none';
      settingsModalContent.style.display = 'none';
      settingsModal.classList.remove('modalFadeOut');
      settingsModalContent.classList.remove('modalFadeOut');
    }, { once: true });
  }
}

function openSettingsModal() {
  const settingsModal = document.getElementById('settingsModal');
  const settingsModalContent = settingsModal.querySelector('.modal-content');
  settingsModal.style.display = 'flex';
  settingsModalContent.style.display = 'block';
}

/* ---------------------------
   安装提示逻辑
--------------------------- */

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

  if (isIOS()) {
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.title = 'iOS 暂不支持安装';
      installBtn.onclick = () => btf.snackbarShow('抱歉，iOS 暂不支持安装本站应用。');
    }
    if (altBtn) {
      altBtn.onclick = () => btf.snackbarShow('抱歉，iOS 暂不支持安装本站应用。');
    }
    if (banner) animateBannerHide(banner);
    return;
  }

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
      banner.classList.remove('show');
      void banner.offsetWidth;
      banner.classList.add('show');
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

/* ---------------------------
   横幅与按钮逻辑
--------------------------- */

function setupInstallButtons() {
  const confirmBtn = document.getElementById('pwaInstallConfirm');
  const dismissBtn = document.getElementById('pwaInstallDismiss');
  const banner = document.getElementById('pwaInstallBanner');

  if (isIOS()) {
    if (confirmBtn) confirmBtn.onclick = () => btf.snackbarShow('抱歉，iOS 暂不支持安装本站应用。');
    if (dismissBtn && banner) dismissBtn.onclick = () => animateBannerHide(banner);
    return;
  }

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
      const dismissUntil = Date.now() + 3 * 24 * 60 * 60 * 1000;
      localStorage.setItem('pwaBannerDismissedUntil', dismissUntil.toString());
      btf.snackbarShow('已忽略安装提示，3天内将不再显示。');
      setTimeout(() => {
        btf.snackbarShow('我们还是建议您安装 PWA 以获得更好的体验。');
      }, 3000);
    };
  }
}

function animateBannerHide(banner) {
  banner.classList.remove('show');
  banner.classList.add('hide');
  banner.addEventListener('transitionend', () => {
    banner.style.display = 'none';
  }, { once: true });
}

/* ---------------------------
   页面初始化与事件绑定
--------------------------- */

window.addEventListener('DOMContentLoaded', () => {
  const modals = [
    document.getElementById('browserChoiceModal'),
    document.getElementById('browserChoiceModal-IOS')
  ];
  const banner = document.getElementById('pwaInstallBanner');

  modals.forEach(m => {
    if (!m) return;
    const mc = m.querySelector('.modal-content');
    m.style.display = 'none';
    if (mc) mc.style.display = 'none';
  });

  if (banner) {
    banner.classList.remove('show', 'hide');
    banner.style.display = 'none';
  }

  updateInstallStatus();
  setupInstallButtons();
});

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📦 捕获 beforeinstallprompt');
  e.preventDefault();
  deferredPrompt = e;
  updateInstallStatus();
});

window.addEventListener('appinstalled', () => {
  console.log('✅ 安装完成');
  deferredPrompt = null;
  sessionStorage.setItem('pwaInstalled', 'true');
  updateInstallStatus();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    updateInstallStatus();
  }
});

document.addEventListener('pjax:complete', () => {
  updateInstallStatus();
  setupInstallButtons();
});
