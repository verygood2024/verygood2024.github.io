// 获取元素
var postItems = document.querySelectorAll('.recent-post-item');
var cardWidgets = document.querySelectorAll('.card-widget');
var animationToggleBtn = document.getElementById('animationToggleBtn');

// 缓冲阈值
var threshold = 50;

// 动画状态，支持本地存储记忆
var animationEnabled = localStorage.getItem('animationEnabled') !== 'false'; // 默认为 true

// 初始化状态
postItems.forEach(function (el) {
    el.style.opacity = 0;
    el.setAttribute('data-animated', 'out');
    el.setAttribute('data-animating', 'false');
});

cardWidgets.forEach(function (el) {
    if (el.id === 'card-toc' || el.classList.contains('toc')) return;

    el.style.opacity = 0;
    el.setAttribute('data-animated', 'out');
    el.setAttribute('data-animated-once', 'false');
});

// 判断是否进入视口（缓冲阈值）
function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight - threshold && rect.bottom > threshold
    );
}

// 滚动动画处理
function handleScrollAnimation() {
    if (!animationEnabled) return;

    // 处理首页文章卡片（反复进出）
    postItems.forEach(function (el) {
        var currentState = el.getAttribute('data-animated');
        var isAnimating = el.getAttribute('data-animating') === 'true';

        if (isInViewport(el)) {
            if (currentState !== 'in' && !isAnimating) {
                playAnimation(el, 'in');
            }
        } else {
            if (currentState !== 'out' && !isAnimating) {
                playAnimation(el, 'out');
            }
        }
    });

    // 处理侧栏卡片（只进不出）
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

// 播放动画（首页卡片，支持反复）
function playAnimation(el, direction) {
    if (!animationEnabled) return;

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

// 动画开关按钮逻辑
animationToggleBtn.addEventListener('click', function () {
    animationEnabled = !animationEnabled;
    localStorage.setItem('animationEnabled', animationEnabled);

    if (!animationEnabled) {
        btf.snackbarShow("已关闭缩放出入动画效果。")
        // 关闭动画：立刻清除动画类、恢复显示
        postItems.forEach(function (el) {
            el.classList.remove('animate__animated', 'animate__zoomIn', 'animate__zoomOut');
            el.style.opacity = 1;
            el.setAttribute('data-animated', 'in');
            el.setAttribute('data-animating', 'false');
        });

        cardWidgets.forEach(function (el) {
            if (el.id === 'card-toc' || el.classList.contains('toc')) return;

            el.classList.remove('animate__animated', 'animate__zoomIn');
            el.style.opacity = 1;
            el.setAttribute('data-animated-once', 'true');
        });
    } else {
        btf.snackbarShow("已开启缩放出入动画效果。")
        // 重新开启动画，重新初始化状态
        postItems.forEach(function (el) {
            el.style.opacity = 0;
            el.setAttribute('data-animated', 'out');
            el.setAttribute('data-animating', 'false');
        });

        cardWidgets.forEach(function (el) {
            if (el.id === 'card-toc' || el.classList.contains('toc')) return;

            el.style.opacity = 0;
            el.setAttribute('data-animated', 'out');
            el.setAttribute('data-animated-once', 'false');
        });

        handleScrollAnimation();
    }
});

// 事件绑定
window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);
window.addEventListener('DOMContentLoaded', handleScrollAnimation);
window.addEventListener('pageshow', function (event) {
    if (!event.persisted) {
        handleScrollAnimation();
    }
});

// 页面加载后立即检测
handleScrollAnimation();
