let deferredPrompt = null;

function isIOS() {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isMobileOrTablet() {
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|windows phone|mobile|tablet/.test(ua);
}

function handleInstallPrompt() {
  if (!deferredPrompt) {
    alert('安装提示尚未准备好，请稍后再试。');
    return;
  }

  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((result) => {
    if (result.outcome === 'accepted') {
      console.log('用户接受安装');
    } else {
      console.log('用户取消安装');
    }
    deferredPrompt = null;

    // 安装后隐藏横幅
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) banner.style.display = 'none';

    // 禁用按钮，防止重复触发
    disableInstallButtons();
  });
}

function disableInstallButtons() {
  const buttons = [
    document.getElementById('installPWA'),
    document.getElementById('pwa-install-btn'),
    document.getElementById('pwaInstallConfirm')
  ];
  buttons.forEach(btn => {
    if (btn) {
      btn.disabled = true;
      btn.style.cursor = 'not-allowed';
    }
  });
}

function enableInstallButtons() {
  const buttons = [
    document.getElementById('installPWA'),
    document.getElementById('pwa-install-btn'),
    document.getElementById('pwaInstallConfirm')
  ];
  buttons.forEach(btn => {
    if (btn) {
      btn.disabled = false;
      btn.style.cursor = 'pointer';
      btn.removeEventListener('click', handleInstallPrompt);
      btn.addEventListener('click', handleInstallPrompt);
    }
  });
}

function setupInstallButtons() {
  const installBtn = document.getElementById('installPWA'); // 辅助按钮
  const altBtn = document.getElementById('pwa-install-btn'); // 始终显示的按钮
  const confirmBtn = document.getElementById('pwaInstallConfirm'); // 横幅确认按钮
  const dismissBtn = document.getElementById('pwaInstallDismiss'); // 横幅关闭按钮
  const banner = document.getElementById('pwaInstallBanner');

  // 默认隐藏辅助按钮和横幅，且禁用所有安装按钮
  if (installBtn) {
    installBtn.style.display = 'none';
    installBtn.disabled = true;
  }
  if (altBtn) altBtn.disabled = true;
  if (confirmBtn) confirmBtn.disabled = true;
  if (banner) banner.style.display = 'none';

  // iOS或已安装，辅助按钮显示提示信息
  if (isInStandaloneMode() || isIOS()) {
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.disabled = false;
      installBtn.title = isIOS()
        ? '请点击 Safari 底部的分享按钮 → “添加到主屏幕”'
        : '应用已安装';
      installBtn.removeEventListener('click', handleInstallPrompt);
      installBtn.addEventListener('click', () => {
        alert(isIOS()
          ? '请点击 Safari 浏览器底部的“分享”图标，然后选择“添加到主屏幕”。'
          : '您已安装本站应用到主屏幕 🎉');
      });
    }
  }

  // 关闭横幅
  if (dismissBtn && banner) {
    dismissBtn.addEventListener('click', () => {
      banner.style.display = 'none';
    });
  }

  // 主按钮：始终显示，但先禁用，后续在beforeinstallprompt事件启用
  if (altBtn) {
    altBtn.removeEventListener('click', handleInstallPrompt);
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
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('installPWA');
  const banner = document.getElementById('pwaInstallBanner');

  if (installBtn) installBtn.style.display = 'inline-block';

  if (banner && isMobileOrTablet()) {
    banner.style.display = 'flex';
  }

  // 所有安装按钮都启用并绑定安装事件
  enableInstallButtons();
});

window.addEventListener('DOMContentLoaded', () => {
  setupInstallButtons();
});
