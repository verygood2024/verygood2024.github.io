function scrollHandler() {
  var pageHeader = document.querySelector('#page-header.full_page');
  if (pageHeader) {
    var scrollTop = window.scrollY;
    var maxHeight = 300;
    var radius = Math.min((scrollTop / maxHeight) * 50, 50);
    pageHeader.style.borderRadius = `0 0 ${radius}px ${radius}px`;
  }

  var footer = document.querySelector('#footer');
  if (footer) {
    // Set the footer background to a linear gradient
    footer.style.background = 'linear-gradient(to right, rgb(95, 158, 160), rgb(70, 130, 180), rgb(176, 196, 222))';
    
    var scrollTop = window.scrollY;
    var footerOffsetTop = footer.getBoundingClientRect().top + scrollTop;
    var docHeight = document.documentElement.scrollHeight;
    var winHeight = window.innerHeight;
    var threshold = footerOffsetTop - winHeight;

    if (scrollTop > threshold) {
      var maxRadius = 50;
      var radius = Math.min(
        ((scrollTop - threshold) / (docHeight - winHeight - threshold)) * maxRadius,
        maxRadius
      );
      footer.style.borderRadius = `${radius}px ${radius}px 0 0`;
    } else {
      footer.style.borderRadius = `0 0 0 0`;
    }
  }
}

// Bind scroll event once
window.addEventListener('scroll', scrollHandler);

// Re-run on PJAX page load
document.addEventListener('pjax:end', scrollHandler);

document.querySelectorAll('.author-info-description').forEach(el => {
  el.textContent = "左右相望、前后相顾、稳步向前";
});

