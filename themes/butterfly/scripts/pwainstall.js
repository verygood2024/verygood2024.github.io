// PWA 安装按钮
hexo.extend.tag.register('pwainstall', function(args) {
  return `
<a class="card-base pwa-install-button" href="javascript:void(0)" id="pwa-install-btn">
  <div class="sponsor-logo">
    <img src="https://yesandnoandperhaps.cn/img/app_ic-playstore.png" alt="PWA-logo" onerror="this.onerror=null;this.src='/img/friend_404.gif'">
  </div>
  <div class="sponsor-info">
    <div class="install-message">
      <i class="fas fa-download"></i> 安装应用
    </div>
    <div class="sponsor-desc">
      点击这里安装yesandnoandperhaps的PWA应用程序，享受更流畅的浏览体验！
    </div>
  </div>
</a>
`;
}, { ends: false });