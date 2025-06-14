// {% cardlist %} ... {% endcardlist %}
hexo.extend.tag.register('cardlist', function(args, content) {
  return `<div class="card-container">\n${content}\n</div>`;
}, { ends: true });

// {% cardwriter link image text %}
hexo.extend.tag.register('cardwriter', function(args) {
  const [link, img, ...textParts] = args;
  const text = textParts.join(' ').replace(/"/g, '');

  return `
    <a href="${decodeURIComponent(link)}" 
       class="card-widget card-link"
       style="background-image: url('${img}')">
      <div class="card-tile-text">${text}</div>
    </a>
  `;
}, { ends: false });
