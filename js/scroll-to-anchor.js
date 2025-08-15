document.addEventListener("DOMContentLoaded", function () {
  const scrollToHash = (hash) => {
    const decodedHash = decodeURIComponent(hash);
    // 使用 getElementById 替代 querySelector，避免特殊字符问题
    const target = document.getElementById(decodedHash.slice(1));
    if (!target) return;

    setTimeout(() => {
      smoothScrollTo(target, 600, 20); // 滚动时间：600ms，顶部偏移：20px
    }, 100);
  };

  // 页面首次加载滚动到锚点
  if (location.hash) {
    scrollToHash(location.hash);
  }

  // 监听锚点点击
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const hash = this.getAttribute("href");
      const decodedHash = decodeURIComponent(hash);
      const target = document.getElementById(decodedHash.slice(1));
      if (target) {
        e.preventDefault();
        history.pushState(null, '', decodedHash);
        scrollToHash(decodedHash);
      }
    });
  });

  /**
   * 自定义平滑滚动（兼容所有浏览器）
   * @param {Element} target - 要滚动到的元素
   * @param {number} duration - 动画时长（毫秒）
   * @param {number} offset - 滚动偏移量（如顶部导航栏高度）
   */
  function smoothScrollTo(target, duration = 500, offset = 0) {
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
    const startPosition = window.scrollY;
    const startTime = performance.now();

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animation(currentTime) {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const run = startPosition + (targetPosition - startPosition) * easeInOutQuad(progress);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }
});
