document.addEventListener('DOMContentLoaded', () => {
  let headerContentWidth, $nav
  let mobileSidebarOpen = false
  /**
   * rightside scroll percent
   */
  const rightsideScrollPercent = currentTop => {
    const scrollPercent = btf.getScrollPercent(currentTop, document.body)
    const goUpElement = document.getElementById('go-up')

    if (scrollPercent < 95) {
      goUpElement.classList.add('show-percent')
      goUpElement.querySelector('.scroll-percent').textContent = scrollPercent
    } else {
      goUpElement.classList.remove('show-percent')
    }
  }

  /**
   * 滾動處理
   */
  const scrollFn = () => {
    const $rightside = document.getElementById('rightside')
    const innerHeight = window.innerHeight + 56
    let initTop = 0
    const $header = document.getElementById('page-header')
    const isChatBtn = typeof chatBtn !== 'undefined'
    const isShowPercent = GLOBAL_CONFIG.percent.rightside

    // 檢查文檔高度是否小於視窗高度
    const checkDocumentHeight = () => {
      if (document.body.scrollHeight <= innerHeight) {
        $rightside.classList.add('rightside-show')
        return true
      }
      return false
    }

    // 如果文檔高度小於視窗高度,直接返回
    if (checkDocumentHeight()) return

    // find the scroll direction
    const scrollDirection = currentTop => {
      const result = currentTop > initTop // true is down & false is up
      initTop = currentTop
      return result
    }

    let flag = ''
    const scrollTask = btf.throttle(() => {
      const currentTop = window.scrollY || document.documentElement.scrollTop
      const isDown = scrollDirection(currentTop)
      if (currentTop > 56) {
        if (flag === '') {
          $header.classList.add('nav-fixed')
          $rightside.classList.add('rightside-show')
        }

        if (isDown) {
          if (flag !== 'down') {
            $header.classList.remove('nav-visible')
            isChatBtn && window.chatBtn.hide()
            flag = 'down'
          }
        } else {
          if (flag !== 'up') {
            $header.classList.add('nav-visible')
            isChatBtn && window.chatBtn.show()
            flag = 'up'
          }
        }
      } else {
        flag = ''
        if (currentTop === 0) {
          $header.classList.remove('nav-fixed', 'nav-visible')
        }
        $rightside.classList.remove('rightside-show')
      }

      isShowPercent && rightsideScrollPercent(currentTop)
      checkDocumentHeight()
    }, 300)

    btf.addEventListenerPjax(window, 'scroll', scrollTask, { passive: true })
  }

  /**
  * toc,anchor
  */
  const scrollFnToDo = () => {
    const isToc = GLOBAL_CONFIG_SITE.isToc
    const isAnchor = GLOBAL_CONFIG.isAnchor
    const $article = document.getElementById('article-container')

    if (!($article && (isToc || isAnchor))) return

    let $tocLink, $cardToc, autoScrollToc, $tocPercentage, isExpand

    if (isToc) {
      const $cardTocLayout = document.getElementById('card-toc')
      $cardToc = $cardTocLayout.querySelector('.toc-content')
      $tocLink = $cardToc.querySelectorAll('.toc-link')
      $tocPercentage = $cardTocLayout.querySelector('.toc-percentage')
      isExpand = $cardToc.classList.contains('is-expand')

      // toc元素點擊
      const tocItemClickFn = e => {
        const target = e.target.closest('.toc-link')
        if (!target) return

        e.preventDefault()
        btf.scrollToDest(btf.getEleTop(document.getElementById(decodeURI(target.getAttribute('href')).replace('#', ''))), 300)
        if (window.innerWidth < 900) {
          $cardTocLayout.classList.remove('open')
        }
      }

      btf.addEventListenerPjax($cardToc, 'click', tocItemClickFn)

      autoScrollToc = item => {
        const sidebarHeight = $cardToc.clientHeight
        const itemOffsetTop = item.offsetTop
        const itemHeight = item.clientHeight
        const scrollTop = $cardToc.scrollTop
        const offset = itemOffsetTop - scrollTop
        const middlePosition = (sidebarHeight - itemHeight) / 2

        if (offset !== middlePosition) {
          $cardToc.scrollTop = scrollTop + (offset - middlePosition)
        }
      }

      // 處理 hexo-blog-encrypt 事件
      $cardToc.style.display = 'block'
    }

    // find head position & add active class
    const $articleList = $article.querySelectorAll('h1,h2,h3,h4,h5,h6')
    let detectItem = ''

    const findHeadPosition = top => {
      if (top === 0) return false

      let currentId = ''
      let currentIndex = ''

      for (let i = 0; i < $articleList.length; i++) {
        const ele = $articleList[i]
        if (top > btf.getEleTop(ele) - 80) {
          const id = ele.id
          currentId = id ? '#' + encodeURI(id) : ''
          currentIndex = i
        } else {
          break
        }
      }

      if (detectItem === currentIndex) return

      if (isAnchor) btf.updateAnchor(currentId)

      detectItem = currentIndex

      if (isToc) {
        $cardToc.querySelectorAll('.active').forEach(i => i.classList.remove('active'))

        if (currentId) {
          const currentActive = $tocLink[currentIndex]
          currentActive.classList.add('active')

          setTimeout(() => autoScrollToc(currentActive), 0)

          if (!isExpand) {
            let parent = currentActive.parentNode
            while (!parent.matches('.toc')) {
              if (parent.matches('li')) parent.classList.add('active')
              parent = parent.parentNode
            }
          }
        }
      }
    }

    // main of scroll
    const tocScrollFn = btf.throttle(() => {
      const currentTop = window.scrollY || document.documentElement.scrollTop
      if (isToc && GLOBAL_CONFIG.percent.toc) {
        $tocPercentage.textContent = btf.getScrollPercent(currentTop, $article)
      }
      findHeadPosition(currentTop)
    }, 100)

    btf.addEventListenerPjax(window, 'scroll', tocScrollFn, { passive: true })
  }

  const handleThemeChange = mode => {
    const globalFn = window.globalFn || {}
    const themeChange = globalFn.themeChange || {}
    if (!themeChange) {
      return
    }

    Object.keys(themeChange).forEach(key => {
      const themeChangeFn = themeChange[key]
      if (['disqus', 'disqusjs'].includes(key)) {
        setTimeout(() => themeChangeFn(mode), 300)
      } else {
        themeChangeFn(mode)
      }
    })
  }

  /**
   * Rightside
   */
  const rightSideFn = {
    readmode: () => { // read mode
      const $body = document.body
      const newEle = document.createElement('button')

      const exitReadMode = () => {
        $body.classList.remove('read-mode')
        newEle.remove()
        newEle.removeEventListener('click', exitReadMode)
      }

      $body.classList.add('read-mode')
      newEle.type = 'button'
      newEle.className = 'fas fa-sign-out-alt exit-readmode'
      newEle.addEventListener('click', exitReadMode)
      $body.appendChild(newEle)
    },
    darkmode: () => { // switch between light and dark mode
      const willChangeMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
      if (willChangeMode === 'dark') {
        btf.activateDarkMode()
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
      } else {
        btf.activateLightMode()
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
      }
      btf.saveToLocal.set('theme', willChangeMode, 2)
      handleThemeChange(willChangeMode)
    },
    'rightside-config': () => {
      const modal = document.getElementById('settingsModal')
      const modalContent = modal.querySelector('.modal-content')

      const isShown = modal.style.display === 'flex'

      if (isShown) {
        modalContent.classList.remove('show')
        modalContent.style.display = 'none'
        modal.style.display = 'none'
      } else {
        modal.style.display = 'flex'
        modalContent.style.display = 'block'
        modalContent.classList.add('show')
      }
    },
    'go-up': () => { // Back to top
      btf.scrollToDest(0, 500)
    },
    'hide-aside-btn': () => { // Hide aside
      const $htmlDom = document.documentElement.classList
      const saveStatus = $htmlDom.contains('hide-aside') ? 'show' : 'hide'
      btf.saveToLocal.set('aside-status', saveStatus, 2)
      $htmlDom.toggle('hide-aside')
    },
    'mobile-toc-button': (p, item) => { // Show mobile toc
      const tocEle = document.getElementById('card-toc')
      tocEle.style.transition = 'transform 0.3s ease-in-out'

      const tocEleHeight = tocEle.clientHeight
      const btData = item.getBoundingClientRect()

      const tocEleBottom = window.innerHeight - btData.bottom - 30
      if (tocEleHeight > tocEleBottom) {
        tocEle.style.transformOrigin = `right ${tocEleHeight - tocEleBottom - btData.height / 2}px`
      }

      tocEle.classList.toggle('open')
      tocEle.addEventListener('transitionend', () => {
        tocEle.style.cssText = ''
      }, { once: true })
    },
    'chat-btn': () => { // Show chat
      window.chatBtnFn()
    },
    translateLink: () => { // switch between traditional and simplified chinese
      window.translateFn.translatePage()
    }
  }

  document.getElementById('rightside').addEventListener('click', e => {
    const $target = e.target.closest('[id]')
    if ($target && rightSideFn[$target.id]) {
      rightSideFn[$target.id](e.currentTarget, $target)
    }
  })

  // 處理 hexo-blog-encrypt 事件
  window.addEventListener('hexo-blog-decrypt', e => {
    forPostFn()
    window.translateFn.translateInitialization()
    Object.values(window.globalFn.encrypt).forEach(fn => {
      fn()
    })
  })
})