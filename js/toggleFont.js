(function () {
  const fonts = {
    1: {
      name: "Noto Serif CJK",
      url: "https://fontsapi.zeoseven.com/285/main/result.css",
      chinese: "思源宋体"
    },
    2: {
      name: "NanoOldSong-A",
      url: "https://fontsapi.zeoseven.com/467/main/result.css",
      chinese: "纳米老宋"
    }
  };

  let currentFont = parseInt(localStorage.getItem("selectedFont"), 10);
  if (![1, 2].includes(currentFont)) currentFont = 1;

  const FONT_LINK_ID = "dynamicFont";

  function applyFont(fontId) {
    const font = fonts[fontId];
    if (!font) return;

    let fontLink = document.getElementById(FONT_LINK_ID);
    if (!fontLink) {
      fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.type = "text/css";
      fontLink.id = FONT_LINK_ID;
      document.head.appendChild(fontLink);
    }

    if (fontLink.href !== font.url) {
      fontLink.href = font.url;
    }

    document.documentElement.style.setProperty("--font-family", font.name);
    localStorage.setItem("selectedFont", fontId.toString());

    // 显示提示
    if (window.btf && typeof btf.snackbarShow === "function") {
      btf.snackbarShow(`已切换为 ${font.chinese}`);
    }
  }

  // 初始设置
  applyFont(currentFont);

  // 暴露切换方法
  window.toggleFont = function () {
    currentFont = currentFont === 1 ? 2 : 1;
    applyFont(currentFont);
  };
})();
