'use strict';

const sortSelect = document.getElementById('sort-select');

// Handle sortSelect onchange.
sortSelect.onchange = async (e) => {
  reloadButton.classList.add('is-loading')

  const sortIcon = document.getElementById('sort-icon')
  sortIcon.classList.remove('fa-sort-alpha-down', 'fa-fire-alt', 'fa-tags')
  switch (e.target.value) {
    case 'alphabetical':
      sortIcon.classList.add('fa-sort-alpha-down')
      break
    case 'popularity':
      sortIcon.classList.add('fa-fire-alt')
      break
    case 'categorical':
      sortIcon.classList.add('fa-tags')
      break
  }

  sortSelect.disabled = true;
  reloadButton.disabled = true;
  langSelect.disabled = true;

  for (const appCardColumnElement of appCardsColumnElements) {
    appCardColumnElement.innerHTML = ''
  }

  appCardColumn = 0

  try {
    const appDetails = await listAppsByCategory(currentSelectedCategory, e.target.value);
    for (const app in appDetails) {
      addAppCard(appDetails[app])
    }
    reloadButton.classList.remove('is-loading')
    sortSelect.disabled = false
    reloadButton.disabled = false
    langSelect.disabled = false;

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
      console.log(err)
    }

    bulmaToast.toast({
      message: i18next.t('app-sort-success'),
      type: 'is-success'
    })
  } catch (err) {
    console.log(err)

    reloadButton.classList.remove('is-loading')
    sortSelect.disabled = false
    reloadButton.disabled = false

    bulmaToast.toast({
      message: err,
      type: 'is-danger'
    })
  }
}