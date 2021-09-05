'use strict';

// Theme switcher init.
const themeSwitcher = new DarkMode({
  light: "assets/css/lib/bulma/bulmaswatch-light.min.css",
  dark: "assets/css/lib/bulma/bulmaswatch-dark.min.css",
  checkSystemScheme: true
});

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
  supportedLngs: ["en", "tl", "vi"],
  fallbackLng: "en",
  backend: {
    loadPath: "assets/i18n/{{lng}}.json"
  }
}).then(async () => {
  // Localize every element marked for localization.
  locHTML(".i18n");

  // Relative time formatting class init.
  relTime.setLanguage(i18next.language);

  langSelect.value = i18next.language;

  await reloadData();
}).catch(err => {
  console.error(err);
  bulmaToast.toast({
    message: err,
    type: "is-danger"
  });
});