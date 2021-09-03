'use strict';

// Language selector.
const langSelect = document.getElementById("lang-select");

langSelect.onchange = async (e) => {
  console.log(`Changed language to: ${e.target.value}`)
  sortSelect.disabled = true;
  reloadButton.disabled = true;
  e.target.disabled = true;

  try {
    await i18next.changeLanguage(e.target.value);
  } catch (err) {
    console.error(err);
    bulmaToast.toast({
      message: err,
      type: "is-danger"
    });
    await i18next.changeLanguage();
  }
  console.log(i18next.language);
  locHTML(".i18n");

  sortSelect.disabled = false;
  reloadButton.disabled = false;
  e.target.disabled = false;
}