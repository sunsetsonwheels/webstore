const darkMode = new DarkMode({
  light: "assets/css/lib/bulmaswatch/flatly.min.css",
  dark: "assets/css/lib/bulmaswatch/darkly.min.css",
  checkSystemScheme: true
})

bulmaToast.setDefaults({
  position: "top-center",
  closeOnClick: true,
  pauseOnHover: true,
  animate: { 
    in: "bounceInDown", 
    out: "bounceOutUp" 
  }
})