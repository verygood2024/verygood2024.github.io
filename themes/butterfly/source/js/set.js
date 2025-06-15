document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeSettingsModalBtn')
  const modal = document.getElementById('settingsModal')
  const modalContent = modal.querySelector('.modal-content')

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalContent.classList.remove('show')
      modalContent.style.display = 'none'
      modal.style.display = 'none'
    })
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const bind = (id, fn) => {
    const btn = document.getElementById(id)
    if (btn && typeof fn === 'function') btn.addEventListener('click', fn)
  }

  // 模块统一挂载前提：你已将以下函数定义在这些对象下
  // 例如：rightSideFn.darkmode, rightSideFn.readmode 等

  bind('darkmode', rightSideFn.darkmode)
  bind('readmode', rightSideFn.readmode)
  bind('translateLink', rightSideFn.translate)
  bind('hide-aside-btn', rightSideFn.hideAside)

  // ⚠️ 这些仍是内联函数调用：
  // toggleFont(), increaseFontSize(), decreaseFontSize(), cacheManager.clearAll(), installApp()
  // 若你想统一管理，也可以这样挂载：
  bind('toggleFont', toggleFont)
  bind('fontsizeIncrease', increaseFontSize)
  bind('fontsizeDecrease', decreaseFontSize)
  bind('cacheManager', () => cacheManager.clearAll())
  bind('installPWA', installApp)
})
