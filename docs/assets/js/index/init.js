"use strict";const themeSwitcher=new DarkMode({light:"assets/css/lib/bulma/bulmaswatch-light.min.css",dark:"assets/css/lib/bulma/bulmaswatch-dark.min.css",checkSystemScheme:!0});bulmaToast.setDefaults({position:"top-center",closeOnClick:!0,pauseOnHover:!0,animate:{in:"bounceInDown",out:"bounceOutUp"}});const MultiDB=new MultiDatabases,StoreDbAPI=new StoreDatabaseAPI,relTime=new RelativeTime(i18next.language),locHTML=locI18next.init(i18next,{selectorAttr:"data-i18n"});i18next.use(i18nextBrowserLanguageDetector).use(I18nextFetchBackend).init({supportedLngs:["en","tl","vi","pl","zh-CN"],fallbackLng:"en",backend:{loadPath:"assets/i18n/{{lng}}.json"}}).then((async()=>{locHTML(".i18n"),relTime.setLanguage(i18next.language),langSelect.value=i18next.language,await reloadData()})).catch((e=>{console.error(e),bulmaToast.toast({message:e,type:"is-danger"})}));