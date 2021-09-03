'use strict';

// Handle hamburger menu button.
for (const navbarBurger of document.getElementsByClassName("navbar-burger")) {
  console.log(navbarBurger)
  navbarBurger.onclick = (e) => {
    e.target.classList.toggle('is-active');
    console.log(e.target.dataset);
    document.getElementById(e.target.dataset.target).classList.toggle('is-active');
  }
}

// Set default options for toast messages
bulmaToast.setDefaults({
  position: 'top-center',
  closeOnClick: true,
  pauseOnHover: true,
  animate: {
    in: 'bounceInDown',
    out: 'bounceOutUp'
  }
});

// StoreDbAPI class init.
const StoreDbAPI = new StoreDatabaseAPI();
// Relative time class init.
const relTime = new RelativeTime(i18next.language);
// Init HTML localization.
const locHTML = locI18next.init(i18next, {
  selectorAttr: "data-i18n"
});

// Load localization
i18next.use(i18nextBrowserLanguageDetector).use(I18nextFetchBackend).init({
  supportedLngs: ["en", "vi"],
  fallbackLng: "en",
  backend: {
    loadPath: "assets/i18n/{{lng}}.json"
  }
}).then(async () => {
  // Localize every element marked for localization.
  locHTML(".i18n");

  // Relative time formatting class init.
  relTime.setLanguage(i18next.language);

  await reloadData();
}).catch(err => {
  console.error(err);
  bulmaToast.toast({
    message: err,
    type: "is-danger"
  });
});

// Handle floating scrollup FAB button.
document.getElementById('scrolltop-fab').onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}