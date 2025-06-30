// 获取首页文章卡片（需要反复动画）
var postItems = document.querySelectorAll('.recent-post-item');

// 获取侧栏卡片（只动画一次，排除 TOC）
var cardWidgets = document.querySelectorAll('.card-widget');

// 缓冲阈值
var threshold = 50;

// 初始化状态
postItems.forEach(function (el) {
    el.style.opacity = 0;
    el.setAttribute('data-animated', 'out');
    el.setAttribute('data-animating', 'false');
});

cardWidgets.forEach(function (el) {
    // 跳过 TOC 卡片
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

    // 处理侧栏卡片（只进不出，排除 TOC）
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

// 播放动画（文章卡片，支持反复）
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


window.addEventListener('scroll', handleScrollAnimation);

window.addEventListener('load', handleScrollAnimation);

window.addEventListener('DOMContentLoaded', handleScrollAnimation);

window.addEventListener('pageshow', function (event) {
    if (!event.persisted) {
        handleScrollAnimation();
    }
});
handleScrollAnimation();
