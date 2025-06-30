window.cacheManager = {
  async clearAll() {
    // 显示自定义确认框
    this.showConfirm('⚠️ 确认要清除本站所有缓存吗？<br>此操作将会清除缓存数据、localStorage、sessionStorage，且不可恢复。', async () => {
      try {
        // 先等待一点时间，确保窗口已关闭
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms 过渡（可调）

        // 清除所有缓存（Service Worker Cache）
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }

        // 清除 localStorage 和 sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // 清除所有 IndexedDB 数据
        const databases = await indexedDB.databases();
        for (const { name } of databases) {
          await indexedDB.deleteDatabase(name);
        }

        // 清除所有 Cookies
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c.trim().split("=")[0] + "=;expires=" + new Date(0).toUTCString() + ";path=/";
        });

        alert('🧹 所有缓存已成功清除，包括浏览器缓存、localStorage、sessionStorage、IndexedDB 和 Cookies。');
        location.reload();
      } catch (e) {
        alert('❌ 清除缓存时发生错误');
        console.error('缓存清除失败:', e);
      }
    });
  },

  showConfirm(message, onConfirm) {
    const modal = document.getElementById('customConfirm');
    modal.querySelector('.custom-modal-content p').innerHTML = message;
    modal.style.display = 'flex';

    window.handleConfirm = function (result) {
      modal.style.display = 'none';
      if (result && typeof onConfirm === 'function') {
        onConfirm(); // 确认后执行
      }
    };
  }
};
