class BulmaModal {
  constructor(selector) {
    this.elem = document.querySelector(selector)
    this.elem.children[1].style.animationDuration = '250ms'
    this.close_data()
  }

  animateCSS (animationName, callback) {
    var modalCard = this.elem.children[1]

    modalCard.classList.add('animate__' + animationName)

    function handleAnimationEnd() {
      modalCard.classList.remove('animate__' + animationName)
      modalCard.removeEventListener('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback()
    }

    modalCard.addEventListener('animationend', handleAnimationEnd)
  }
  
  show () {
    this.elem.children[1].scrollTop = 0
    this.animateCSS('zoomIn')
    this.elem.classList.add('is-active')
    this.on_show()
  }
  
  close () {
    var that = this
    this.animateCSS('zoomOut', () => {
      that.elem.classList.remove('is-active')
      that.on_close()
    })
  }
  
  close_data () {
    var modalClose = this.elem.querySelectorAll("[data-bulma-modal='close'], .modal-background")
    var that = this
    modalClose.forEach(function(e) {
      e.addEventListener('click', function() {
        that.animateCSS('zoomOut', function () {
          that.elem.classList.remove('is-active')
        })
        that.on_close();
      })
    })
  }
  
  on_show () {
    var event = new Event('modal:show')
    this.elem.dispatchEvent(event);
  }
  
  on_close () {
    var event = new Event('modal:close')
    this.elem.dispatchEvent(event);
  }
  
  addEventListener(event, callback) {
    this.elem.addEventListener(event, callback)
  }
}
