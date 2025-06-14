// 赞助卡片
hexo.extend.tag.register('sponsorcard', function(args) {
  const [link, img, ...descParts] = args;
  const desc = descParts.join(' ').replace(/"/g, '');

  return `
<a class="card-base sponsor-card" href="${decodeURIComponent(link)}" target="_self" rel="external nofollow noreferrer" title="赞助我们">
  <div class="sponsor-logo">
    <img src="${img}" alt="赞助logo" onerror="this.onerror=null;this.src='/img/friend_404.gif'">
  </div>
  <div class="sponsor-info">
    <div class="sponsor-name">
      <i class="fas fa-heart"></i> 赞助我们
    </div>
    <div class="sponsor-desc" title="${desc}">
      ${desc}
    </div>
  </div>
</a>
`;
}, { ends: false });