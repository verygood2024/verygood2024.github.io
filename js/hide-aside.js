// 监听 <html> 元素的 class 变化
const observer = new MutationObserver(() => {
  const grid = document.querySelector('.recent-post-items.grid-layout');
  if (grid) {
    grid.style.display = 'none';
    void grid.offsetHeight; // 强制回流
    grid.style.display = '';
  }
});

// 开始监听 <html> 的属性变化（class）
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
});
