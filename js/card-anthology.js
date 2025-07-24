(function () {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) return;

  document.querySelectorAll('.card-anthology-card').forEach(card => {
    let tapped = false;
    let timeoutId = null;

    // 双击机制
    card.addEventListener('click', function (e) {
      if (!tapped) {
        e.preventDefault();
        tapped = true;
        card.classList.add('touched');

        timeoutId = setTimeout(() => {
          tapped = false;
          card.classList.remove('touched');
        }, 3000);
      } else {
        clearTimeout(timeoutId);
        window.location.href = card.href;
      }
    });

    // 自动根据图片背景调整文字颜色
    const img = card.querySelector('img');
    const overlay = card.querySelector('.card-anthology-overlay');

    function getAverageColor(image, callback) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return callback('#ffffff');

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      try {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        const total = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.floor(r / total);
        g = Math.floor(g / total);
        b = Math.floor(b / total);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        const textColor = brightness < 128 ? '#ffffff' : '#000000';
        callback(textColor);
      } catch (err) {
        callback('#ffffff');
      }
    }

    function applyTextColor() {
      getAverageColor(img, color => {
        overlay.style.color = color;
      });
    }

    if (img.complete) {
      applyTextColor();
    } else {
      img.onload = applyTextColor;
    }
  });
})();

