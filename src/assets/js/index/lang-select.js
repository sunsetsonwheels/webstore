'use strict';

// Language selector.
const langSelect = document.getElementById("lang-select");

langSelect.onchange = async (e) => {
  e.target.disabled = true;
  sortSelect.disabled = true;
  reloadButton.disabled = true;
  searchInput.disabled = true;
  searchButton.disabled = true;
  exitSearchButton.disabled = true;

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
  locHTML(".i18n");

  e.target.disabled = false;
  sortSelect.disabled = false;
  reloadButton.disabled = false;
  searchInput.disabled = false;
  searchButton.disabled = false;
  if (isSearching) exitSearchButton.disabled = false;
}