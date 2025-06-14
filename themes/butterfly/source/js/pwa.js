let deferredPrompt = null;

// 判断是否为 iOS
function isIOS() {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

// 判断是否为移动设备或平板
function isMobileOrTablet() {
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|windows phone|mobile|tablet/.test(ua);
}

// 判断是否为 Edge 浏览器
function isEdge() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('edg'); // Chrome 的 UA 中包含 edg
}

// 判断是否在独立窗口运行（PWA 模式）
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// 更新安装状态（横幅/按钮）
function updateInstallStatus() {
  const banner = document.getElementById('pwaInstallBanner');
  const installBtn = document.getElementById('installPWA');
  const altBtn = document.getElementById('pwa-install-btn');

  if (isInStandaloneMode() || isIOS()) {
    if (banner) banner.style.display = 'none';
    if (installBtn) {
      installBtn.innerText = '已安装';
      installBtn.title = '您已安装本站应用';
      installBtn.onclick = () => alert('您已安装本站应用 🎉');
    }
    if (altBtn) {
      altBtn.onclick = () => alert('您已安装本站应用 🎉');
    }
  }
}

// 引导用户安装 Edge
function promptInstallEdge() {
  alert('您的浏览器不支持安装本站应用。\n请使用 Microsoft Edge 浏览器访问本站以安装应用。');
  window.open('https://www.microsoft.com/edge', '_blank');
}

// 安装处理逻辑
function handleInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'accepted') {
        console.log('用户接受安装');
      } else {
        console.log('用户取消安装');
        promptInstallEdge(); // 用户取消时提示 Edge
      }
      deferredPrompt = null;

      const banner = document.getElementById('pwaInstallBanner');
      if (banner) banner.style.display = 'none';
    });
  } else {
    promptInstallEdge(); // 无 prompt 时，说明浏览器不支持
  }
}

// 初始化按钮事件
function setupInstallButtons() {
  const installBtn = document.getElementById('installPWA'); // 辅助按钮
  const altBtn = document.getElementById('pwa-install-btn'); // 主按钮
  const confirmBtn = document.getElementById('pwaInstallConfirm'); // 横幅确认按钮
  const dismissBtn = document.getElementById('pwaInstallDismiss'); // 横幅关闭按钮
  const banner = document.getElementById('pwaInstallBanner');

  if (installBtn) installBtn.style.display = 'none';
  if (banner) banner.style.display = 'none';

  if (isInStandaloneMode() || isIOS()) {
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.title = isIOS()
        ? '请点击 Safari 底部的分享按钮 → “添加到主屏幕”'
        : '应用已安装';
      installBtn.addEventListener('click', () => {
        alert(isIOS()
          ? '请点击 Safari 浏览器底部的“分享”图标，然后选择“添加到主屏幕”。'
          : '您已安装本站应用 🎉');
      });
    }
  } else {
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.addEventListener('click', () => {
        if (!isEdge()) {
          promptInstallEdge();
        } else {
          handleInstallPrompt();
        }
      });
    }
  }

  if (altBtn) {
    altBtn.addEventListener('click', () => {
      if (isInStandaloneMode()) {
        alert('您已经安装过此应用 🎉');
      } else if (!isEdge()) {
        promptInstallEdge();
      } else if (deferredPrompt) {
        handleInstallPrompt();
      } else {
        alert('安装提示尚未准备好，请稍后再试。');
      }
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (!isEdge()) {
        promptInstallEdge();
      } else {
        handleInstallPrompt();
      }
    });
  }

  if (dismissBtn && banner) {
    dismissBtn.addEventListener('click', () => {
      banner.style.display = 'none';
    });
  }
}

// 捕获浏览器支持安装 PWA 的事件
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('捕获到 beforeinstallprompt 事件');
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('installPWA');
  const banner = document.getElementById('pwaInstallBanner');

  if (installBtn) installBtn.style.display = 'inline-block';

  // 仅在移动端显示横幅
  if (banner && isMobileOrTablet()) {
    banner.style.display = 'flex';
  }
});

// PWA 安装成功
window.addEventListener('appinstalled', () => {
  console.log('PWA 安装成功');
  deferredPrompt = null;
  updateInstallStatus();
});

// 页面切回来时重新判断
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    updateInstallStatus();
  }
});

// 持续轮询判断安装状态（性能无顾虑）
setInterval(updateInstallStatus, 1000);

// 初始化入口
window.addEventListener('DOMContentLoaded', () => {
  setupInstallButtons();
  setTimeout(updateInstallStatus, 1000);
});
