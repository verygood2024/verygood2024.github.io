(function () {
  // ---------- 工具函数 ----------
  function getAverageColor(ctx, x, y, w, h) {
    const pixels = ctx.getImageData(x, y, w, h).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i];
      g += pixels[i + 1];
      b += pixels[i + 2];
      count++;
    }
    return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
  }

  function getLuminance([r, g, b]) {
    const f = c => {
      c /= 255;
      return c <= 0.03928
        ? c / 12.92
        : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }

  function generateBestReadableColor([r, g, b]) {
    const luminance = getLuminance([r, g, b]);
    if (luminance > 0.7) {
      return '#222'; // 背景很亮
    } else if (luminance < 0.3) {
      return '#fff'; // 背景很暗
    } else {
      // 中间亮度，取反后微调
      const inv = c => Math.min(255, Math.floor((255 - c) * 1.1 + 10));
      return `rgb(${inv(r)}, ${inv(g)}, ${inv(b)})`;
    }
  }

  // ---------- 主逻辑 ----------
  function applyAutoTextColor() {
    const header = document.querySelector('#page-header.nav-fixed');
    if (!header) return;

    const navLinks = header.querySelectorAll('#nav a');
    if (!navLinks.length) return;

    const rect = header.getBoundingClientRect();

    html2canvas(document.body, {
      useCORS: true,
      backgroundColor: null,
      scale: 0.1
    }).then(canvas => {
      const ctx = canvas.getContext('2d');
      const avgRGB = getAverageColor(ctx, rect.left, rect.top, rect.width, rect.height);
      const bestColor = generateBestReadableColor(avgRGB);

      navLinks.forEach(a => {
        a.style.color = bestColor;
      });
    });
  }

  // ---------- 初始化 + PJAX 适配 ----------
  function init() {
    applyAutoTextColor();
  }

  document.addEventListener('DOMContentLoaded', init);

  // PJAX 页面更新（Hexo NexT/Butterfly 等框架常见事件）
  document.addEventListener('pjax:complete', init);
  document.addEventListener('pjax:end', init);
})();