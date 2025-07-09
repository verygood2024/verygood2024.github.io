let handleNavAndRightside; // 提前声明，供其他地方调用
let isSettingsModalVisible = false;
let isPwaBannerVisible = false;     // 记录菜单打开前 banner 是否显示
let navLockState = null; // 控制是否锁定 nav 状态：null=默认滚动控制，true=强制显示，false=强制隐藏

function isModalCurrentlyVisible() {
  const modal = document.getElementById('settingsModal');
  return modal && modal.style.display === 'flex';
}

function clearNavLock() {
  navLockState = null;
}

function isModalCurrentlyVisible() {
  const modal = document.getElementById('settingsModal');
  return modal && modal.style.display === 'flex';
}

document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar-menus');
  const pageHeader = document.getElementById('page-header');
  const rightside = document.getElementById('rightside');

  if (!sidebar || !pageHeader || !rightside) return;

  let rightsideWasEmpty = false;

  handleNavAndRightside = function (options = {}) {
    const { hideNav = false, hideRightside = false, hideModal = null, hidePwa = null } = options;
    const isFullPage = pageHeader.classList.contains('full_page');
    const isFixed = pageHeader.classList.contains('nav-fixed');
    const pwaBanner = document.getElementById('pwaInstallBanner');

    /** 🔹 控制导航栏 **/
    if (hideNav) {
      navLockState = false;
      if (!(isFullPage && !isFixed)) {
        pageHeader.classList.remove('nav-visible');
      }
    } else {
      navLockState = null; // 不锁定，恢复 scroll 控制
      if (!(isFullPage && !isFixed)) {
        pageHeader.classList.add('nav-visible'); // 显示一次
      }
    }

    /** 🔹 控制右侧栏 **/
    if (hideRightside) {
      rightside.className = '';
    } else {
      if (!rightsideWasEmpty) {
        rightside.className = 'rightside-show';
      }
    }

    /** 🔹 控制设置弹窗 **/
    if (hideModal !== null) {
      toggleSettingsModal(!hideModal); // true=显示, false=隐藏
    } else if (!hideRightside) {
      if (isSettingsModalVisible) {
        toggleSettingsModal(true);
      }
    } else {
      isSettingsModalVisible = isModalCurrentlyVisible();
      if (isSettingsModalVisible) {
        toggleSettingsModal(false);
      }
    }

    /** 🔹 控制 PWA 安装横幅 **/
    const isDesktop = !/Android|webOS|iPhone|iPod|BlackBerry|iPad|Windows Phone/i.test(navigator.userAgent);
    if (isDesktop) {
      if (pwaBanner) {
        pwaBanner.classList.remove('show');
        pwaBanner.classList.add('hide');
        pwaBanner.style.display = 'none';
      }
      return;
    }

    if (hidePwa !== null) {
      if (pwaBanner) {
        if (hidePwa) {
          pwaBanner.classList.remove('show');
          pwaBanner.classList.add('hide');
          pwaBanner.style.display = 'none';
        } else {
          pwaBanner.classList.remove('hide');
          pwaBanner.classList.add('show');
          pwaBanner.style.display = 'flex';
        }
      }
    } else if (hideRightside) {
      if (pwaBanner && pwaBanner.classList.contains('show')) {
        isPwaBannerVisible = true;
        pwaBanner.classList.remove('show');
        pwaBanner.classList.add('hide');
        pwaBanner.style.display = 'none';
      } else {
        isPwaBannerVisible = false;
      }
    } else {
      if (isPwaBannerVisible && pwaBanner) {
        pwaBanner.classList.remove('hide');
        pwaBanner.classList.add('show');
        pwaBanner.style.display = 'flex';
      }
    }
  };

  // 监听 sidebar 的展开/收起
  const observer = new MutationObserver(() => {
    const isOpen = sidebar.classList.contains('open');
    const options = isOpen ? { hideNav: true, hideRightside: true } : { hideNav: false, hideRightside: false };
    handleNavAndRightside(options);
  });

  observer.observe(sidebar, {
    attributes: true,
    attributeFilter: ['class']
  });
});
