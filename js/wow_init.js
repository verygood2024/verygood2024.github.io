// 获取元素（仅初始化时查询一次）
var postItemsA, cardWidgets, animationToggleBtn;

// 初始化元素
function initializeElements() {
    postItemsA = document.querySelectorAll('.recent-post-item');
    cardWidgets = document.querySelectorAll('.card-widget');
    animationToggleBtn = document.getElementById('animationToggleBtn');
}

// 缓冲阈值
var threshold = 50;

var legacySetting = localStorage.getItem('animationEnabled');
if (legacySetting !== null) {
    // 自动转换旧值为新模式
    localStorage.removeItem('animationEnabled');
    if (legacySetting === 'false') {
        localStorage.setItem('animationMode', 'off');
    } else {
        localStorage.setItem('animationMode', 'once'); // 你默认喜欢单次动画
    }
}

// 三种动画模式：repeat（反复）、once（单次）、off（关闭）
var animationMode = localStorage.getItem('animationMode') || 'once';

// 初始化状态（根据动画模式区分处理）
function initAnimationState() {
    if (animationMode === 'off') {
        postItemsA.forEach(function (el) {
            el.style.opacity = 1;
            el.setAttribute('data-animated', 'in');
            el.setAttribute('data-animating', 'false');
        });
        cardWidgets.forEach(function (el) {
            if (el.id === 'card-toc' || el.classList.contains('toc')) return;
            el.style.opacity = 1;
            el.setAttribute('data-animated-once', 'true');
        });
    } else {
        postItemsA.forEach(function (el) {
            el.style.opacity = 0;
            el.setAttribute('data-animated', 'out');
            el.setAttribute('data-animating', 'false');
        });
        cardWidgets.forEach(function (el) {
            if (el.id === 'card-toc' || el.classList.contains('toc')) return;
            el.style.opacity = 0;
            el.setAttribute('data-animated-once', 'false');
        });
    }
}

// 判断是否进入视口（缓冲阈值）
function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight - threshold && rect.bottom > threshold;
}

// 滚动动画处理
function handleScrollAnimation() {
    if (animationMode === 'off') return;

    // 首页文章卡片处理
    postItemsA.forEach(function (el) {
        var currentState = el.getAttribute('data-animated');
        var isAnimating = el.getAttribute('data-animating') === 'true';

        if (isInViewport(el)) {
            if (currentState !== 'in' && !isAnimating) {
                playAnimation(el, 'in');
            }
        } else if (animationMode === 'repeat') {
            if (currentState !== 'out' && !isAnimating) {
                playAnimation(el, 'out');
            }
        }
    });

    // 侧栏卡片处理（只进不出）
    cardWidgets.forEach(function (el) {
        if (el.id === 'card-toc' || el.classList.contains('toc')) return;

        var hasAnimated = el.getAttribute('data-animated-once') === 'true';

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

// 播放动画（首页卡片）
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

document.addEventListener('DOMContentLoaded', function () {
    // 三种模式切换按钮逻辑
    animationToggleBtn.addEventListener('click', function () {
        if (animationMode === 'repeat') {
            animationMode = 'once';
            btf.snackbarShow("已切换为动画单次模式。");
        } else if (animationMode === 'once') {
            animationMode = 'off';
            btf.snackbarShow("已切换为动画关闭模式。");
        } else {
            animationMode = 'repeat';
            btf.snackbarShow("已切换为动画反复模式。");
        }

        localStorage.setItem('animationMode', animationMode);

        // 清除现有动画类
        postItemsA.forEach(function (el) {
            el.classList.remove('animate__animated', 'animate__zoomIn', 'animate__zoomOut');
        });

        cardWidgets.forEach(function (el) {
            el.classList.remove('animate__animated', 'animate__zoomIn');
        });

        initAnimationState();
        forceCheckAnimation();
    });
})

// 强制连续检测动画
function forceCheckAnimation(retryCount = 10) {
    if (retryCount <= 0) return;
    handleScrollAnimation();
    requestAnimationFrame(() => {
        forceCheckAnimation(retryCount - 1);
    });
}

// 初始化
initializeElements();
initAnimationState();

// 页面加载时检测和初始化
function onPageLoad() {
    initializeElements();  // 确保每次页面加载都重新初始化元素
    initAnimationState();  // 设置初始状态
    forceCheckAnimation();  // 强制检测动画
}

// 如果是PJAX页面加载完成时（如果使用了PJAX库）
document.addEventListener('pjax:complete', onPageLoad);

// 页面加载后立即检测（防止首次加载时遗漏）
window.addEventListener('load', onPageLoad);

// 事件绑定
window.addEventListener('scroll', handleScrollAnimation);

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') {
        forceCheckAnimation();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    forceCheckAnimation();
});

window.addEventListener('pageshow', function (event) {
    if (!event.persisted) {
        forceCheckAnimation();
    }
});

// 页面加载后立即检测
forceCheckAnimation();
