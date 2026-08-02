function createRectangleCard(e,c,t,s,n){return`
    <a class="card-base sponsor-card" href="${decodeURIComponent(e)}" target="_self" rel="external nofollow noreferrer" title="${t}">
      <div class="sponsor-logo">
        <img src="${c}" alt="${t} logo" onerror="this.onerror=null;this.src='/img/friend_404.gif'">
      </div>
      <div class="sponsor-info">
        <div class="rectangle-name">
          ${s||""} ${t}
        </div>
        <div class="sponsor-desc" title="${n}">
          ${n}
        </div>
      </div>
    </a>
  `}document.addEventListener("DOMContentLoaded",function(){var e,c=document.getElementById("post");"/posts/cb559e1b.html"===window.location.pathname&&c&&(e=createRectangleCard("https://mp.weixin.qq.com/s/Q_mr9p6cAe3AmJwushRcRg","/img/app_ic-playstore.png","购买文章",`
    <svg t="1757251203288" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
      <path d="M830.4 64h-130.6c-9.2 0-17.6 5.2-21.6 13.4l-110.8 226.4c-29 69.4-54.2 143.8-54.2 143.8h-2.6s-25.2-74.4-54.2-143.8L345.6 77.4c-4-8.2-12.4-13.4-21.6-13.4H193.6c-18.2 0-29.6 19.4-21.2 35.2L332.6 400H216c-13.2 0-24 10.8-24 24v64c0 13.2 10.8 24 24 24h176.4l39.6 74.4V640H216c-13.2 0-24 10.8-24 24v64c0 13.2 10.8 24 24 24h216v184c0 13.2 10.8 24 24 24h112c13.2 0 24-10.8 24-24v-184h216c13.2 0 24-10.8 24-24v-64c0-13.2-10.8-24-24-24H592v-53.6l39.6-74.4H808c13.2 0 24-10.8 24-24v-64c0-13.2-10.8-24-24-24h-116.6l160.2-300.8c8.6-15.8-3-35.2-21.2-35.2z" fill="#639ebc"></path>
    </svg>
  `,"快速前往购买文章，获取网页版密钥。"),c.insertAdjacentHTML("afterbegin",e))});