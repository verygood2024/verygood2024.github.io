// 缓存 DOM 元素
var pageHeader = document.querySelector('#page-header.full_page');
var footer = document.querySelector('#footer');

function scrollHandler() {
  var scrollTop = window.scrollY;
  var maxHeight = 300;
  var isMobile = window.innerWidth < 768;

  // 优化：避免重复查询 DOM 元素
  if (pageHeader) {
    if (isMobile) {
      pageHeader.style.height = '280px';
      pageHeader.style.borderRadius = '0 0 30px 30px';
    } else {
      pageHeader.style.height = '100vh';
      var radius = Math.min((scrollTop / maxHeight) * 35, 35);
      pageHeader.style.borderRadius = `0 0 ${radius}px ${radius}px`;
    }
  }

  if (footer) {
    // 页脚的背景和圆角变化
    footer.style.background = 'linear-gradient(to right, rgb(95, 158, 160), rgb(70, 130, 180), rgb(176, 196, 222))';

    var footerOffsetTop = footer.getBoundingClientRect().top + scrollTop;
    var docHeight = document.documentElement.scrollHeight;
    var winHeight = window.innerHeight;
    var threshold = footerOffsetTop - winHeight;

    if (scrollTop > threshold) {
      var maxRadius = 50;
      var radius = Math.min(
        ((scrollTop - threshold) / (docHeight - winHeight - threshold)) * maxRadius,
        maxRadius
      );
      footer.style.borderRadius = `${radius}px ${radius}px 0 0`;
    } else {
      footer.style.borderRadius = `0 0 0 0`;
    }
  }
}

// 使用 requestAnimationFrame 以优化滚动事件的性能
var scrollTimeout;
function optimizedScrollHandler() {
  if (!scrollTimeout) {
    scrollTimeout = requestAnimationFrame(function() {
      scrollHandler();
      scrollTimeout = null;
    });
  }
}

// 添加事件监听器
window.addEventListener('resize', scrollHandler);
window.addEventListener('scroll', optimizedScrollHandler);  // 使用优化后的滚动事件处理函数
document.addEventListener('DOMContentLoaded', scrollHandler);
document.addEventListener('pjax:end', scrollHandler);

// 初始化执行
scrollHandler();
