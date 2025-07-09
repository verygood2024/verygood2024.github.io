function toggleSettingsModal(forceShow = null) {
  const modal = document.getElementById('settingsModal');
  const modalContent = modal.querySelector('.modal-content');
  const btn = document.getElementById('rightside-config');
  const tocEle = document.getElementById('card-toc');

  const btnRect = btn.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const deltaX = btnRect.left + btnRect.width / 2 - viewportWidth / 2;
  const deltaY = btnRect.top + btnRect.height / 2 - viewportHeight / 2;

  const isOpening = modal.style.display !== 'flex' && !modal.classList.contains('modalFadeIn');
  const isClosing = modal.classList.contains('modalFadeOut');
  if (isClosing) return;

  modal.style.willChange = 'transform';
  modal.style.setProperty('--start-x', `${deltaX}px`);
  modal.style.setProperty('--start-y', `${deltaY}px`);
  modalContent.style.setProperty('--start-x', `${deltaX}px`);
  modalContent.style.setProperty('--start-y', `${deltaY}px`);

  if (forceShow === true || (forceShow === null && isOpening)) {
    // 显示
    modal.style.display = 'flex';
    modalContent.style.display = 'flex';
    modal.classList.add('modalFadeIn');
    modalContent.classList.add('modalFadeIn');

    modalContent.addEventListener('animationend', () => {
      modal.classList.remove('modalFadeIn');
      modalContent.classList.remove('modalFadeIn');
      modal.style.willChange = '';
    }, { once: true });
  } else if (forceShow === false || (forceShow === null && !isOpening)) {
    // 隐藏
    modal.classList.add('modalFadeOut');
    modalContent.classList.add('modalFadeOut');

    modalContent.addEventListener('animationend', () => {
      modal.style.display = 'none';
      modalContent.style.display = 'none';
      modal.classList.remove('modalFadeOut');
      modalContent.classList.remove('modalFadeOut');
      modal.style.willChange = '';
    }, { once: true });
  }

  // 处理 TOC 收起
  if (tocEle && tocEle.classList.contains('open')) {
    const tocBtn = document.querySelector('#rightside #mobile-toc-button');
    const btData = tocBtn ? tocBtn.getBoundingClientRect() : { bottom: window.innerHeight / 2, height: 40 };
    const tocEleHeight = tocEle.clientHeight;
    const tocEleBottom = window.innerHeight - btData.bottom - 30;

    if (tocEleHeight > tocEleBottom) {
      tocEle.style.transformOrigin = `right ${tocEleHeight - tocEleBottom - btData.height / 2}px`;
    }

    tocEle.style.transition = 'transform 0.3s ease-in-out';
    tocEle.classList.remove('open');
    handleNavAndRightside({ hideNav: false, hideRightside: false });
    updateInstallStatus();

    tocEle.addEventListener('transitionend', () => {
      tocEle.style.cssText = '';
      tocEle.style.willChange = '';
    }, { once: true });
  }
}
