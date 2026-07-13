document.addEventListener('DOMContentLoaded', () => {
    const settingsModal = document.getElementById('settingsModal');
    const settingsModalContent = settingsModal?.querySelector('.modal-content');
    const rightsideConfigBtn = document.getElementById('rightside-config');
    let cachedRightsideConfigBtnCenter = null;

    if (rightsideConfigBtn) {
        const rect = rightsideConfigBtn.getBoundingClientRect();
        cachedRightsideConfigBtnCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    window.cacheManager = {
        _modal: document.getElementById('customConfirm'),
        _modalContent: document.querySelector('#customConfirm .custom-modal-content'),
        _triggerBtn: document.getElementById('cacheManager'),
        _onConfirm: null,

        async clearAll() {
            this.closeSettingsModal();

            this.showConfirm('', async () => {
                try {
                    await this.closeAnimation();

                    // 保存PWA版本状态，防止清除后误认为更新
                    const savedVersion = localStorage.getItem('hexo_cache_version');

                    // 清理LocalStorage
                    localStorage.clear();
                    if (savedVersion) {
                        localStorage.setItem('hexo_cache_version', savedVersion);
                    }

                    // 清理Session状态
                    sessionStorage.clear();

                    // 删除IndexedDB
                    if (indexedDB.databases) {
                        try {
                            const databases = await indexedDB.databases();
                            for (const db of databases) {
                                if (db.name) {
                                    await indexedDB.deleteDatabase(db.name);
                                }
                            }
                        } catch(e) {
                            console.warn('[Cache] IndexedDB清理失败', e);
                        }
                    }

                    // 清理Cookie
                    document.cookie.split(';').forEach(cookie => {
                        const name = cookie.split('=')[0].trim();
                        if (name) {
                            document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
                        }
                    });

                    // 清理Cache Storage
                    if ('caches' in window) {
                        const keys = await caches.keys();
                        await Promise.all(keys.map(key => caches.delete(key)));
                    }

                    // 注销Service Worker
                    if ('serviceWorker' in navigator) {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        for (const registration of registrations) {
                            await registration.unregister();
                            console.log('[SW]已注销:', registration.scope);
                        }
                    }

                    // 等浏览器释放SW
                    await new Promise(resolve => setTimeout(resolve, 800));

                    // 重新初始化
                    location.reload();
                } catch(e) {
                    console.error('[Cache]清理失败:', e);
                    alert('❌ 清除缓存失败，请稍后重试');
                }
            });
        },

        showConfirm(message, onConfirm) {
            if (!this._modal) return;

            handleNavAndRightside({
                hideNav: true,
                hideRightside: true,
                hidePwa: true
            });

            this._onConfirm = onConfirm;

            if (message && message.trim()) {
                this._modal.querySelector('.custom-modal-content p').innerHTML = message;
            }

            this._modal.style.display = 'flex';

            const btnRect = this._triggerBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;
            const deltaX = btnCenterX - window.innerWidth / 2;
            const deltaY = btnCenterY - window.innerHeight / 2;

            this._modalContent.style.transition = 'none';
            this._modalContent.style.transform = `translate(${deltaX}px,${deltaY}px) scale(0.1)`;
            this._modalContent.offsetWidth;

            requestAnimationFrame(() => {
                this._modalContent.style.transition = 'transform .4s ease';
                this._modalContent.style.transform = 'translate(0,0) scale(1)';
            });
        },

        async closeAnimation() {
            return new Promise(resolve => {
                const btn = this._triggerBtn;
                let x = window.innerWidth / 2;
                let y = window.innerHeight / 2;

                if (btn) {
                    const rect = btn.getBoundingClientRect();
                    x = rect.left + rect.width / 2;
                    y = rect.top + rect.height / 2;
                }

                handleNavAndRightside({
                    hideNav: false,
                    hideRightside: false,
                    hidePwa: false
                });

                const deltaX = x - window.innerWidth / 2;
                const deltaY = y - window.innerHeight / 2;

                this._modalContent.style.transition = 'transform .4s ease';
                this._modalContent.style.transform = `translate(${deltaX}px,${deltaY}px) scale(0.1)`;

                this._modalContent.addEventListener('transitionend', () => {
                    this._modal.style.display = 'none';
                    resolve();
                }, { once: true });
            });
        },

        closeSettingsModal() {
            if (settingsModal && settingsModal.style.display === 'flex') {
                settingsModal.classList.add('modalFadeOut');
                settingsModalContent.classList.add('modalFadeOut');
            }
        },

        openSettingsModal() {
            if (!settingsModal) return;
            settingsModal.style.display = 'flex';
            settingsModalContent.style.display = 'block';
        }
    };

    window.handleConfirm = function(result) {
        if (!window.cacheManager) return;

        if (result) {
            window.cacheManager._onConfirm && window.cacheManager._onConfirm();
        } else {
            window.cacheManager.closeAnimation().then(() => {
                window.cacheManager.openSettingsModal();
            });
        }
    };

    document.getElementById('cacheManager')?.addEventListener('click', () => {
        window.cacheManager.clearAll();
    });
});