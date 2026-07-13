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

                    // 保存版本号，防止清除后被误认为第一次访问
                    const savedVersion = localStorage.getItem('hexo_cache_version');
                    localStorage.clear();
                    if (savedVersion) {
                        localStorage.setItem('hexo_cache_version', savedVersion);
                    }

                    // 标记主动清理，给sw-register.js识别
                    localStorage.setItem('hexo_manual_clear', 'true');

                    // 清理session
                    sessionStorage.clear();

                    // 清理IndexedDB
                    if (indexedDB.databases) {
                        try {
                            const databases = await indexedDB.databases();
                            for (const {name} of databases) {
                                if (name) {
                                    await indexedDB.deleteDatabase(name);
                                }
                            }
                        } catch(e) {
                            console.warn('[Cache] IndexedDB清理失败', e);
                        }
                    }

                    // Cookie
                    document.cookie.split(';').forEach(cookie => {
                        const name = cookie.split('=')[0].trim();
                        if (name) {
                            document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
                        }
                    });

                    // 先注销SW，防止SW继续写缓存
                    if ('serviceWorker' in navigator) {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        for (const registration of registrations) {
                            await registration.unregister();
                            console.log('Service Worker 已注销:', registration.scope);
                        }
                    }

                    // 删除Cache Storage
                    if ('caches' in window) {
                        const keys = await caches.keys();
                        for (const key of keys) {
                            console.log('[Cache]删除:', key);
                            await caches.delete(key);
                        }
                    }

                    // 等浏览器释放SW
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    await this.fetchLatestContent();
                    location.reload();
                } catch(e) {
                    alert('❌ 清除缓存时发生错误');
                    console.error('缓存清理失败:', e);
                }
            });
        },

        // 强制获取最新HTML
        async fetchLatestContent() {
            try {
                const response = await fetch(window.location.href, {
                    method: 'GET',
                    cache: 'no-store'
                });
                if (response.ok) {
                    console.log('已从服务器加载最新内容');
                } else {
                    console.error('服务器响应失败:', response.status);
                }
            } catch(e) {
                console.error('获取最新内容失败:', e);
            }
        },

        // 打开确认框，保留你的动画计算
        showConfirm(message, onConfirm) {
            if (!this._modal) return;

            handleNavAndRightside({
                hideNav: true,
                hideRightside: true,
                hidePwa: true
            });

            this._onConfirm = onConfirm;

            if (message && message.trim() !== '') {
                this._modal.querySelector('.custom-modal-content p').innerHTML = message;
            }

            this._modal.style.display = 'flex';

            const btnRect = this._triggerBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;
            const deltaX = btnCenterX - window.innerWidth / 2;
            const deltaY = btnCenterY - window.innerHeight / 2;

            this._modalContent.style.transition = 'none';
            this._modalContent.style.transformOrigin = 'center center';
            this._modalContent.style.transform = `translate(${deltaX}px,${deltaY}px) scale(0.1)`;
            this._modalContent.offsetWidth;

            requestAnimationFrame(() => {
                this._modalContent.style.transition = 'transform .4s ease';
                this._modalContent.style.transform = 'translate(0,0) scale(1)';
            });
        },

        // 关闭动画，保留你的按钮位置计算
        async closeAnimation() {
            return new Promise(resolve => {
                const isBtnVisible = btn => {
                    if (!btn) return false;
                    const rect = btn.getBoundingClientRect();
                    return (
                        rect.width > 0 &&
                        rect.height > 0 &&
                        rect.top >= 0 &&
                        rect.left >= 0
                    );
                };

                let btnCenterX;
                let btnCenterY;

                if (isBtnVisible(this._triggerBtn)) {
                    const rect = this._triggerBtn.getBoundingClientRect();
                    btnCenterX = rect.left + rect.width / 2;
                    btnCenterY = rect.top + rect.height / 2;
                } else if (isBtnVisible(rightsideConfigBtn)) {
                    const rect = rightsideConfigBtn.getBoundingClientRect();
                    btnCenterX = rect.left + rect.width / 2;
                    btnCenterY = rect.top + rect.height / 2;
                } else if (cachedRightsideConfigBtnCenter) {
                    btnCenterX = cachedRightsideConfigBtnCenter.x;
                    btnCenterY = cachedRightsideConfigBtnCenter.y;
                } else {
                    btnCenterX = window.innerWidth / 2;
                    btnCenterY = window.innerHeight / 2;
                }

                handleNavAndRightside({
                    hideNav: false,
                    hideRightside: false,
                    hidePwa: false
                });

                const deltaX = btnCenterX - window.innerWidth / 2;
                const deltaY = btnCenterY - window.innerHeight / 2;

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

                settingsModalContent.addEventListener('animationend', () => {
                    settingsModal.style.display = 'none';
                    settingsModalContent.style.display = 'none';
                    settingsModal.classList.remove('modalFadeOut');
                    settingsModalContent.classList.remove('modalFadeOut');
                }, { once: true });
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

    const cacheBtn = document.getElementById('cacheManager');
    if (cacheBtn) {
        cacheBtn.onclick = () => {
            window.cacheManager.clearAll();
        };
    }
});