'use strict';

const sortSelect = document.getElementById('sort-select');

// Handle sortSelect onchange.
sortSelect.onchange = async (e) => {
  sortSelect.disabled = true;
  reloadButton.disabled = true;
  langSelect.disabled = true;
  searchInput.disabled = true;
  searchButton.disabled = true;
  exitSearchButton.disabled = true;

  reloadButton.classList.add('is-loading');

  const sortIcon = document.getElementById('sort-icon')
  sortIcon.classList.remove('fa-sort-alpha-down', 'fa-fire-alt', 'fa-tags', "fa-sort-numeric-down-alt");
  switch (e.target.value) {
    case 'alphabetical':
      sortIcon.classList.add('fa-sort-alpha-down');
      break;
    case 'popularity':
      sortIcon.classList.add('fa-fire-alt');
      break;
    case 'categorical':
      sortIcon.classList.add('fa-tags');
      break;
    case "ratings":
      sortIcon.classList.add("fa-sort-numeric-down-alt");
      break;
  }

  for (const appCardColumnElement of appCardsColumnElements) {
    appCardColumnElement.innerHTML = ''
  }

  appCardColumn = 0

  try {
    let appDetails;
    if (isSearching) {
      appDetails = await StoreDbAPI.searchApps(searchInput.value);
    } else {
      appDetails = await listAppsByCategory(currentSelectedCategory, e.target.value);
    }

    var len = 0;
    for (const app in appDetails) {
      addAppCard(appDetails[app]);
      len++;
    }

    document.getElementById('data-total-apps-label').innerText = len;

    reloadButton.classList.remove('is-loading')
    sortSelect.disabled = false
    reloadButton.disabled = false
    langSelect.disabled = false;
    searchInput.disabled = false;
    searchButton.disabled = false;
    if (isSearching) exitSearchButton.disabled = false;

    try {
      const appSlug = window.location.hash.split('#')[1]
      if (typeof appSlug !== 'undefined') {
        document.querySelector(`.app-details[data-app-slug="${appSlug}"]`).click()
        window.location.hash = appSlug
      } else {
        window.location.hash = ''
      }
    } catch (err) {
      window.location.hash = ''
      console.error(err);
      bulmaToast.toast({
        message: err,
        type: "is-danger"
      });
    }
  } catch (err) {
    console.log(err);
    bulmaToast.toast({
      message: err,
      type: 'is-danger'
    });

    sortSelect.disabled = false;
    reloadButton.disabled = false;
    langSelect.disabled = false;
    reloadButton.classList.remove('is-loading');
  }
}