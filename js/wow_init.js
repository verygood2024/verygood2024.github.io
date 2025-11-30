// --------------------
// 元素初始化
// --------------------
var postItemsA, cardWidgets, animationToggleBtn;

function initializeElements() {
  postItemsA = document.querySelectorAll('.recent-post-item:not(.mermaid-wrap)');
  cardWidgets = document.querySelectorAll('.card-widget:not(.mermaid-wrap)');
  card_container = document.querySelectorAll('.card-container');
  animationToggleBtn = document.getElementById('animationToggleBtn');
}

// --------------------
// 缓冲阈值
// --------------------
var threshold = 50;

// --------------------
// 兼容旧版设置
// --------------------
var legacySetting = localStorage.getItem('animationEnabled');
if (legacySetting !== null) {
  localStorage.removeItem('animationEnabled');
  localStorage.setItem('animationMode', legacySetting === 'false' ? 'off' : 'once');
}

// 动画模式：repeat（反复）、once（单次）、off（关闭）
var animationMode = localStorage.getItem('animationMode') || 'once';

// --------------------
// 初始化状态
// --------------------
function initAnimationState() {
  postItemsA.forEach(el => {
      el.setAttribute('data-initialized', 'true');
      if (animationMode === 'off') {
        el.style.opacity = 1;
        el.style.transform = 'scale(1)';
        el.setAttribute('data-animated', 'in');
      } else {
        el.style.opacity = 0;
        el.style.transform = 'scale(0.3)';
        el.setAttribute('data-animated', 'out');
      }
      el.setAttribute('data-animating', 'false');
      el.style.animationDelay = '';
      el.style.animationDuration = '';
      el.classList.remove('animate__animated', 'animate__zoomIn', 'animate__zoomOut');
  });

  cardWidgets.forEach(el => {
    if (el.id === 'card-toc' || el.classList.contains('toc')) return;
    const inner = el.querySelector('.card-inner');
    if (!inner) return;
      inner.setAttribute('data-initialized', 'true');
      if (animationMode === 'off') {
        inner.style.opacity = 1;
        inner.style.transform = 'scale(1)';
        inner.setAttribute('data-animated-once', 'true');
      } else {
        inner.style.opacity = 0;
        inner.style.transform = 'scale(0.3)';
        inner.setAttribute('data-animated-once', 'false');
      }
      inner.style.animationDelay = '';
      inner.style.animationDuration = '';
      inner.classList.remove('animate__animated', 'animate__zoomIn', 'animate__zoomOut');
    });
}

// --------------------
// 视口判断
// --------------------
function isInViewport(el) {
  var rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight - threshold && rect.bottom > threshold;
}

// --------------------
// 播放动画
// --------------------
function playAnimation(el, direction, fixedDelay = null) {
  if (el.getAttribute('data-animating') === 'true') return;
  el.setAttribute('data-animating', 'true');

  const delay = fixedDelay !== null ? fixedDelay : Math.random() * 0.3;
  const duration = fixedDelay !== null ? 0.6 : 0.5 + Math.random() * 0.3;
  el.style.animationDelay = `${delay}s`;
  el.style.animationDuration = `${duration}s`;

  el.classList.remove('animate__animated', 'animate__zoomIn', 'animate__zoomOut');
  void el.offsetWidth;

  if (direction === 'in') {
    el.classList.add('animate__animated', 'animate__zoomIn');
    el.style.opacity = 1;
    el.style.transform = '';
    el.addEventListener('animationend', function handler() {
      el.setAttribute('data-animated', 'in');
      el.setAttribute('data-animating', 'false');
      el.style.animationDelay = '';
      el.style.animationDuration = '';
      el.style.transform = 'scale(1)';
      el.classList.remove('animate__animated', 'animate__zoomIn');
      el.removeEventListener('animationend', handler);
    });
  } else {
    el.classList.add('animate__animated', 'animate__zoomOut');
    el.style.opacity = 0;
    el.addEventListener('animationend', function handler() {
      el.setAttribute('data-animated', 'out');
      el.setAttribute('data-animating', 'false');
      el.style.animationDelay = '';
      el.style.animationDuration = '';
      el.style.transform = 'scale(0.3)';
      el.classList.remove('animate__animated', 'animate__zoomOut');
      el.removeEventListener('animationend', handler);
    });
  }
}

// --------------------
// 滚动动画检测
// --------------------
function handleScrollAnimation() {
  if (animationMode === 'off') return;

  // postItems 随机动画
  [...postItemsA, ...cardWidgets].forEach(el => {
    const currentState = el.getAttribute('data-animated');
    if (isInViewport(el)) {
      if (currentState !== 'in') playAnimation(el, 'in');
    } else if (animationMode === 'repeat' && currentState !== 'out') {
      playAnimation(el, 'out');
    }
  });
}

// --------------------
// 切换按钮处理
// --------------------
function handleAnimationToggle() {
  if (animationMode === 'repeat') {
    animationMode = 'once';
    window.btf?.snackbarShow?.("已切换为动画单次模式。");
  } else if (animationMode === 'once') {
    animationMode = 'off';
    window.btf?.snackbarShow?.("已切换为动画关闭模式。");
  } else {
    animationMode = 'repeat';
    window.btf?.snackbarShow?.("已切换为动画反复模式。");
  }

  localStorage.setItem('animationMode', animationMode);
  initAnimationState();
  forceCheckUntilStable();
}

// --------------------
// 按钮绑定
// --------------------
function bindToggleButton() {
  if (animationToggleBtn) {
    animationToggleBtn.removeEventListener('click', handleAnimationToggle);
    animationToggleBtn.addEventListener('click', handleAnimationToggle);
  }
}

// --------------------
// 强制检测直到稳定
// --------------------
function forceCheckUntilStable(retryCount = 30) {
  if (retryCount <= 0) return;
  handleScrollAnimation();

  const remaining = [...postItemsA].some(el => el.getAttribute('data-animated') !== 'in');
  if (remaining) requestAnimationFrame(() => forceCheckUntilStable(retryCount - 1));
}

// --------------------
// 滚动节流
// --------------------
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

// --------------------
// 页面加载
// --------------------
function onPageLoad() {
  initializeElements();
  initAnimationState();
  bindToggleButton();
  forceCheckUntilStable();
}

window.addEventListener('load', onPageLoad);
document.addEventListener('pjax:complete', onPageLoad);
window.addEventListener('wheel', handleScrollAnimation, { passive: true });
window.addEventListener('touchmove', handleScrollAnimation, { passive: true });
window.addEventListener('scroll', onScrollHandler);
document.addEventListener('readystatechange', () => { if (document.readyState === 'interactive') forceCheckUntilStable(); });
document.addEventListener('DOMContentLoaded', () => forceCheckUntilStable());
window.addEventListener('pageshow', event => { if (!event.persisted) forceCheckUntilStable(); });

// --------------------
// 初始调用
// --------------------
initializeElements();
initAnimationState();
bindToggleButton();
forceCheckUntilStable();