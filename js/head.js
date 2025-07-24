function scrollHandler() {
  var pageHeader = document.querySelector('#page-header.full_page');
  if (pageHeader) {
    var scrollTop = window.scrollY;
    var maxHeight = 300;
    var isMobile = window.innerWidth < 768;

    if (isMobile) {
      pageHeader.style.height = '280px';
    } else {
      pageHeader.style.height = '100vh';
    }

    // 移动设备：固定30px圆角
    if (isMobile) {
      pageHeader.style.borderRadius = '0 0 30px 30px';
    } 
    // 桌面设备：初始0 + 滚动增加圆角（最大35px）
    else {
      var radius = Math.min((scrollTop / maxHeight) * 35, 35);
      pageHeader.style.borderRadius = `0 0 ${radius}px ${radius}px`;
    }
  }

  // 页脚效果保持不变
  var footer = document.querySelector('#footer');
  if (footer) {
    footer.style.background = 'linear-gradient(to right, rgb(95, 158, 160), rgb(70, 130, 180), rgb(176, 196, 222))';
    
    var scrollTop = window.scrollY;
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

// 添加事件监听器
window.addEventListener('resize', scrollHandler);
window.addEventListener('scroll', scrollHandler);
document.addEventListener('DOMContentLoaded', scrollHandler);
document.addEventListener('pjax:end', scrollHandler);

// 初始化执行
scrollHandler();