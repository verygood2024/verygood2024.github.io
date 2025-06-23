const modal = document.getElementById('settingsModal');
const btn = document.getElementById('rightside-config');
const modalContent = modal.querySelector('.modal-content');

function getDelta() {
  const btnRect = btn.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const deltaX = btnRect.left + btnRect.width / 2 - viewportWidth / 2;
  const deltaY = btnRect.top + btnRect.height / 2 - viewportHeight / 2;

  return `${deltaX}px, ${deltaY}px`;
}

btn.addEventListener('click', () => {
  if (!modal.classList.contains('modalFadeIn') && !modal.classList.contains('modalFadeOut')) {
    // 打开动画
    modal.style.setProperty('--start-x', getDelta());
    modal.style.setProperty('--start-y', getDelta().split(', ')[1]); // 取Y的部分

    modal.classList.remove('modalFadeOut');
    modal.classList.add('modalFadeIn');
    modal.style.display = 'flex';

    modal.addEventListener('animationend', () => {
      modal.classList.remove('modalFadeIn');
    }, { once: true });
  } else if (!modal.classList.contains('modalFadeOut')) {
    // 关闭动画
    modal.style.setProperty('--start-x', getDelta());
    modal.style.setProperty('--start-y', getDelta().split(', ')[1]);

    modal.classList.remove('modalFadeIn');
    modal.classList.add('modalFadeOut');

    modal.addEventListener('animationend', () => {
      modal.style.display = 'none';
      modal.classList.remove('modalFadeOut');
    }, { once: true });
  }
});
