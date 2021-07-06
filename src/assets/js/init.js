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

var lang = new Lang();
lang.dynamic("en", "assets/locales/en.json");
lang.dynamic("zh-CN", "assets/locales/zh-CN.json");
lang.init({
  defaultLang: "en",
  currentLang: 'en',
  cookie: {
    name: 'langCookie',
    expiry: 365,
    path: '/'
  },
  allowCookieOverride: true
});
