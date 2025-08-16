// 获取元素（仅初始化时查询一次）
var postItemsA, cardWidgets, animationToggleBtn;

// 初始化元素（排除 mermaid-wrap）
function initializeElements() {
  postItemsA = document.querySelectorAll('.recent-post-item:not(.mermaid-wrap)');
  cardWidgets = document.querySelectorAll('.card-widget:not(.mermaid-wrap)');
  animationToggleBtn = document.getElementById('animationToggleBtn');
}

// 缓冲阈值
var threshold = 50;

// 兼容旧版设置
var legacySetting = localStorage.getItem('animationEnabled');
if (legacySetting !== null) {
  localStorage.removeItem('animationEnabled');
  localStorage.setItem('animationMode', legacySetting === 'false' ? 'off' : 'once');
}

// 动画模式：repeat（反复）、once（单次）、off（关闭）
var animationMode = localStorage.getItem('animationMode') || 'once';

// 初始化状态
function initAnimationState() {
  if (animationMode === 'off') {
    postItemsA.forEach(el => {
      el.style.opacity = 1;
      el.setAttribute('data-animated', 'in');
      el.setAttribute('data-animating', 'false');
    });
    cardWidgets.forEach(el => {
      if (el.id === 'card-toc' || el.classList.contains('toc')) return;
      el.style.opacity = 1;
      el.setAttribute('data-animated-once', 'true');
    });
  } else {
    postItemsA.forEach(el => {
      el.style.opacity = 0;
      el.setAttribute('data-animated', 'out');
      el.setAttribute('data-animating', 'false');
    });
    cardWidgets.forEach(el => {
      if (el.id === 'card-toc' || el.classList.contains('toc')) return;
      el.style.opacity = 0;
      el.setAttribute('data-animated-once', 'false');
    });
  }
}

// 是否在视口内
function isInViewport(el) {
  var rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight - threshold && rect.bottom > threshold;
}

// 滚动动画检测
function handleScrollAnimation() {
  if (animationMode === 'off') return;

  postItemsA.forEach(el => {
    const currentState = el.getAttribute('data-animated');
    const isAnimating = el.getAttribute('data-animating') === 'true';

    if (isInViewport(el)) {
      if (currentState !== 'in' && !isAnimating) playAnimation(el, 'in');
    } else if (animationMode === 'repeat') {
      if (currentState !== 'out' && !isAnimating) playAnimation(el, 'out');
    }
  });

  cardWidgets.forEach(el => {
    if (el.id === 'card-toc' || el.classList.contains('toc')) return;

    const hasAnimated = el.getAttribute('data-animated-once') === 'true';

    if (isInViewport(el) && !hasAnimated) {
      el.classList.add('animate__animated', 'animate__zoomIn');
      el.style.opacity = 1;
      el.addEventListener('animationend', function handler() {
        el.setAttribute('data-animated-once', 'true');
        el.removeEventListener('animationend', handler);
      });
    }
  });
}

// 播放动画
function playAnimation(el, direction) {
  el.setAttribute('data-animating', 'true');

  if (direction === 'in') {
    el.classList.remove('animate__zoomOut');
    void el.offsetWidth;
    el.classList.add('animate__animated', 'animate__zoomIn');
    el.style.opacity = 1;
    el.addEventListener('animationend', function handler() {
      el.setAttribute('data-animated', 'in');
      el.setAttribute('data-animating', 'false');
      el.removeEventListener('animationend', handler);
    });
  } else {
    el.classList.remove('animate__zoomIn');
    void el.offsetWidth;
    el.classList.add('animate__animated', 'animate__zoomOut');
    el.style.opacity = 0;
    el.addEventListener('animationend', function handler() {
      el.setAttribute('data-animated', 'out');
      el.setAttribute('data-animating', 'false');
      el.removeEventListener('animationend', handler);
    });
  }
}

// 按钮点击处理函数
function handleAnimationToggle() {
  if (animationMode === 'repeat') {
    animationMode = 'once';
    if (window.btf && window.btf.snackbarShow) {
      window.btf.snackbarShow("已切换为动画单次模式。");
    }
  } else if (animationMode === 'once') {
    animationMode = 'off';
    if (window.btf && window.btf.snackbarShow) {
      window.btf.snackbarShow("已切换为动画关闭模式。");
    }
  } else {
    animationMode = 'repeat';
    if (window.btf && window.btf.snackbarShow) {
      window.btf.snackbarShow("已切换为动画反复模式。");
    }
  }

  localStorage.setItem('animationMode', animationMode);

  // 重置所有动画类
  postItemsA.forEach(el => {
    el.classList.remove('animate__animated', 'animate__zoomIn', 'animate__zoomOut');
  });

  cardWidgets.forEach(el => {
    if (el.id === 'card-toc' || el.classList.contains('toc')) return;
    el.classList.remove('animate__animated', 'animate__zoomIn');
  });

  initAnimationState();
  forceCheckUntilStable();
}

// 绑定按钮事件
function bindToggleButton() {
  if (animationToggleBtn) {
    animationToggleBtn.removeEventListener('click', handleAnimationToggle);
    animationToggleBtn.addEventListener('click', handleAnimationToggle);
  }
}

// 强制持续检测直到稳定
function forceCheckUntilStable(retryCount = 30) {
  if (retryCount <= 0) return;
  handleScrollAnimation();

  const remaining = [...postItemsA].some(el => {
    return el.getAttribute('data-animated') !== 'in';
  });

  if (remaining) {
    requestAnimationFrame(() => forceCheckUntilStable(retryCount - 1));
  }
}

// 页面加载时触发初始化
function onPageLoad() {
  initializeElements();
  initAnimationState();
  bindToggleButton();
  forceCheckUntilStable();
}

// 事件绑定
window.addEventListener('load', onPageLoad);
document.addEventListener('pjax:complete', onPageLoad);

window.addEventListener('wheel', handleScrollAnimation, { passive: true });
window.addEventListener('touchmove', handleScrollAnimation, { passive: true });

let scrollAnimationScheduled = false;
function onScrollHandler() {
  if (!scrollAnimationScheduled) {
    scrollAnimationScheduled = true;
    requestAnimationFrame(() => {
      handleScrollAnimation();
      scrollAnimationScheduled = false;
    });
  }
}
window.addEventListener('scroll', onScrollHandler);

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') {
    forceCheckUntilStable();
  }
});
document.addEventListener('DOMContentLoaded', () => {
  forceCheckUntilStable();
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) {
    forceCheckUntilStable();
  }
});

// 初始化调用
initializeElements();
initAnimationState();
bindToggleButton();
forceCheckUntilStable();
