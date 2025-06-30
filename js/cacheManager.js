document.addEventListener('DOMContentLoaded', () => {
  const settingsModal = document.getElementById('settingsModal');
  const settingsModalContent = settingsModal.querySelector('.modal-content');
  const rightsideConfigBtn = document.getElementById('rightside-config');

  window.cacheManager = {
    _modal: document.getElementById('customConfirm'),
    _modalContent: document.querySelector('#customConfirm .custom-modal-content'),
    _triggerBtn: document.getElementById('cacheManager'),

    _onConfirm: null,

    async clearAll() {
      this.closeSettingsModal();

      this.showConfirm(
        '确认要清除本站所有缓存吗？<br>此操作将会清除缓存数据、localStorage、sessionStorage，且不可恢复。',
        async () => {
          try {
            await this.closeAnimation();

            localStorage.clear();
            sessionStorage.clear();

            const databases = await indexedDB.databases();
            for (const { name } of databases) {
              if (name) await indexedDB.deleteDatabase(name);
            }

            document.cookie.split(";").forEach(c => {
              document.cookie = c.trim().split("=")[0] + "=;expires=" + new Date(0).toUTCString() + ";path=/";
            });

            const keys = await caches.keys();
            for (const key of keys) {
              await caches.delete(key);
            }

            location.reload();

          } catch (e) {
            alert('❌ 清除缓存时发生错误');
            console.error('缓存清除失败:', e);
          }
        }
      );
    },

    showConfirm(message, onConfirm) {
      this._onConfirm = onConfirm;
      this._modal.querySelector('.custom-modal-content p').innerHTML = message;

      this._modal.style.display = 'flex';

      const btnRect = this._triggerBtn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const modalCenterX = viewportWidth / 2;
      const modalCenterY = viewportHeight / 2;

      const deltaX = btnCenterX - modalCenterX;
      const deltaY = btnCenterY - modalCenterY;

      this._modalContent.style.transition = 'none';
      this._modalContent.style.transformOrigin = 'center center';
      this._modalContent.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;
      this._modalContent.offsetWidth;

      requestAnimationFrame(() => {
        this._modalContent.style.transition = 'transform 0.4s ease';
        this._modalContent.style.transform = 'translate(0, 0) scale(1)';
      });
    },

    async closeAnimation() {
      return new Promise((resolve) => {
        let targetBtn = this._triggerBtn;

        const isBtnVisible = (btn) => {
          const rect = btn.getBoundingClientRect();
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
        };

        // 如果 cacheManager 不可见，就用 rightside-config
        if (!isBtnVisible(targetBtn)) {
          targetBtn = rightsideConfigBtn;
        }

        const btnRect = targetBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const modalCenterX = viewportWidth / 2;
        const modalCenterY = viewportHeight / 2;

        const deltaX = btnCenterX - modalCenterX;
        const deltaY = btnCenterY - modalCenterY;

        this._modalContent.style.transition = 'transform 0.4s ease';
        this._modalContent.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;

        const onTransitionEnd = () => {
          this._modal.style.display = 'none';
          this._modalContent.removeEventListener('transitionend', onTransitionEnd);
          resolve();
        };
        this._modalContent.addEventListener('transitionend', onTransitionEnd);
      });
    },

    closeSettingsModal() {
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
    },

    openSettingsModal() {
      settingsModal.style.display = 'flex';
      settingsModalContent.style.display = 'block';
    }
  };

  window.handleConfirm = function (result) {
    if (window.cacheManager) {
      if (result) {
        window.cacheManager._onConfirm && window.cacheManager._onConfirm();
      } else {
        window.cacheManager.closeAnimation().then(() => {
          window.cacheManager.openSettingsModal();
        });
      }
    }
  };

  document.getElementById('cacheManager').addEventListener('click', () => {
    window.cacheManager.clearAll();
  });
});
