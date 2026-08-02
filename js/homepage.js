(()=>{if(!window.__card_effect_inited__){window.__card_effect_inited__=!0;let t=".recent-post-item",s=70,c=20;function o(d){if(!d.__cardAnimated__){d.__cardAnimated__=!0;let e;d.addEventListener("mousemove",r=>{cancelAnimationFrame(e),e=requestAnimationFrame(()=>{return e=r,t=d.getBoundingClientRect(),o=t.left+t.width/2,o=e.clientX-o,e=e.clientY-(t.top+t.height/2),a=Math.pow(e/t.height,3)*-s,i=Math.pow(o/t.width,3)*s,n=o/t.width*c,e=e/t.height*c,d.style.transform=`
        perspective(1000px)
        rotateX(${a}deg)
        rotateY(${i}deg)
        scale3d(1.03, 1.03, 1.03)
      `,void(d.style.boxShadow=`
        ${n}px ${e}px 40px
        rgba(0,0,0,${.1+.1*Math.abs(o/t.width)})
      `);var e,t,o,a,i,n})}),d.addEventListener("mouseleave",()=>{cancelAnimationFrame(e),d.style.transition="transform 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.4s ease",d.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)",d.style.boxShadow="none",setTimeout(()=>{d.style.transition="transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.2s ease"},600)})}}function e(){document.querySelectorAll(t).forEach(o)}e(),document.addEventListener("pjax:complete",e),new MutationObserver(e=>{e.forEach(({addedNodes:e})=>{e.forEach(e=>{1===e.nodeType&&(e.matches?.(t)&&o(e),e.querySelectorAll?.(t).forEach(o))})})}).observe(document.body,{childList:!0,subtree:!0})}})();