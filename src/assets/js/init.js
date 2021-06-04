bulmaToast.setDefaults({
  position: 'top-center',
  closeOnClick: true,
  pauseOnHover: true,
  animate: {
    in: 'bounceInDown',
    out: 'bounceOutUp'
  }
})

dayjs.extend(window.dayjs_plugin_relativeTime)

for (const navbarBurger of document.getElementsByClassName('navbar-burger')) {
  navbarBurger.onclick = () => {
    navbarBurger.classList.toggle('is-active')
    document.getElementById(navbarBurger.dataset.target).classList.toggle('is-active')
  }
}
