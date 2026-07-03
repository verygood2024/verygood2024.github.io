(() => {
  // 防止 PJAX 重复初始化
  if (window.__card_effect_inited__) return;
  window.__card_effect_inited__ = true;

  const CARD_SELECTOR = '.recent-post-item';
  const SENSITIVITY = 70;
  const SHADOW_INTENSITY = 20;

  function createCardAnimator(card) {
    // 防止同一卡片重复绑定
    if (card.__cardAnimated__) return;
    card.__cardAnimated__ = true;

    let animationFrame;

    const updateTransform = (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const posX = e.clientX - centerX;
      const posY = e.clientY - centerY;

      const rotateX = Math.pow(posY / rect.height, 3) * -SENSITIVITY;
      const rotateY = Math.pow(posX / rect.width, 3) * SENSITIVITY;

      const shadowX = (posX / rect.width) * SHADOW_INTENSITY;
      const shadowY = (posY / rect.height) * SHADOW_INTENSITY;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.03, 1.03, 1.03)
      `;
      card.style.boxShadow = `
        ${shadowX}px ${shadowY}px 40px
        rgba(0,0,0,${0.1 + Math.abs(posX / rect.width) * 0.1})
      `;
    };

    const throttledMove = (e) => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => updateTransform(e));
    };

    card.addEventListener('mousemove', throttledMove);
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(animationFrame);
      card.style.transition =
        'transform 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.4s ease';
      card.style.transform =
        'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      card.style.boxShadow = 'none';

      setTimeout(() => {
        card.style.transition =
          'transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.2s ease';
      }, 600);
    });
  }

  function initCardEffects() {
    document.querySelectorAll(CARD_SELECTOR).forEach(createCardAnimator);
  }

  // 首次加载
  initCardEffects();

  // 监听 PJAX 页面切换后的 DOM 更新
  document.addEventListener('pjax:complete', initCardEffects);

  // 监听异步 DOM 插入（仅创建一次 Observer）
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.matches?.(CARD_SELECTOR)) createCardAnimator(node);
        node.querySelectorAll?.(CARD_SELECTOR).forEach(createCardAnimator);
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
