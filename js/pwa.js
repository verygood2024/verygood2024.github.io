let deferredPrompt = null;

/* ---------------------------
   设备与支持检测
--------------------------- */

function isIOS() {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

function isMobileOrTablet() {
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|windows phone|mobile|tablet/.test(ua);
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

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

async function isPWAInstalled() {
  if (isInStandaloneMode()) return true;
  if (sessionStorage.getItem('pwaInstalled') === 'true') return true;
  if (await checkRelatedApps()) return true;
  return false;
}

function isPWAInstallSupported() {
  return 'onbeforeinstallprompt' in window;
}

function isRelatedAppsSupported() {
  return 'getInstalledRelatedApps' in navigator;
}

async function shouldPromptBrowserChoice() {
  if (isIOS()) return false;
  return !(isPWAInstallSupported() && isRelatedAppsSupported());
}

/* ---------------------------
   模态窗口控制部分
--------------------------- */

function bindModalEvents(modal, reopenSettings = false) {
  if (!modal) return;
  const modalContent = modal.querySelector('.modal-content');
  const installEdgeBtn = modal.querySelector('#installEdgeBtn');
  const installChromeBtn = modal.querySelector('#installChromeBtn');
  const closeModalBtn = modal.querySelector('#closeModalBtn');
  const closeModalBtnIOS = modal.querySelector('#closeModalBtnIOS');

  if (installEdgeBtn) installEdgeBtn.onclick = () => window.open('https://www.microsoft.com/edge', '_blank');
  if (installChromeBtn) installChromeBtn.onclick = () => window.open('https://www.google.com/chrome/', '_blank');
  if (closeModalBtn) closeModalBtn.onclick = () => closeModal(modal, modalContent, reopenSettings);
  if (closeModalBtnIOS) closeModalBtnIOS.onclick = () => closeModal(modal, modalContent, reopenSettings);
}

function closeModal(modal, modalContent, reopenSettings = false) {
  modalContent.classList.remove('show-animation');
  modalContent.classList.add('hide-animation');

  modalContent.addEventListener('animationend', () => {
    modal.style.display = 'none';
    modalContent.style.display = 'none';
    modalContent.classList.remove('hide-animation');

    if (reopenSettings) openSettingsModal();
    handleNavAndRightside({ hideNav: false, hideRightside: false, hidePwa: false });
  }, { once: true });
}

function openSettingsModal() {
  const settingsModal = document.getElementById('settingsModal');
  if (!settingsModal) return;
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
    if (altBtn) altBtn.onclick = () => btf.snackbarShow(`您已安装本站应用`);
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
      void banner.offsetWidth;
      banner.classList.add('show');
    } else {
      animateBannerHide(banner);
    }
  }

  if (installBtn) {
    installBtn.style.display = 'inline-block';
    installBtn.onclick = async () => {
      if (!deferredPrompt) return btf.snackbarShow("安装尚未准备好或已完成，请稍后再试。");
      handleInstallPrompt();
    };
  }

  if (altBtn) {
    altBtn.onclick = async () => {
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

  if (confirmBtn) {
    confirmBtn.onclick = async () => {
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
  if (document.visibilityState === 'visible') updateInstallStatus();
});

document.addEventListener('pjax:complete', () => {
  updateInstallStatus();
  setupInstallButtons();
});
