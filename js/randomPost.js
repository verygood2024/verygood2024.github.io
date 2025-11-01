let cachedUrls = null;

function randomPost() {
    if (!cachedUrls) {
        fetch('/baidusitemap.xml')
            .then(res => res.text())
            .then(str => {
                let data = (new window.DOMParser()).parseFromString(str, "text/xml");
                cachedUrls = Array.from(data.querySelectorAll('url loc')).map(i => i.innerHTML);
                redirectToRandomPost();
            });
    } else {
        redirectToRandomPost();
    }
}

function redirectToRandomPost() {
    let url;
    do {
        url = cachedUrls[Math.floor(Math.random() * cachedUrls.length)];
    } while (location.href === url);
    location.href = url;
    btf.snackbarShow("已随机访问一篇文章~");
}
