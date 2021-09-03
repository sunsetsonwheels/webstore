'use strict';

// Global elements.
const reloadButton = document.getElementById('reload-button');

// Reload data.
async function reloadData () {
  sortSelect.disabled = true
  reloadButton.classList.add('is-loading')
  reloadButton.disabled = true

  categoriesTabsElement.innerHTML = ''

  for (const appCardColumnElement of appCardsColumnElements) {
    appCardColumnElement.innerHTML = ''
  }

  try {
    await StoreDbAPI.loadDb()

    for (const category in StoreDbAPI.db.categories) {
      categoriesTabsElement.innerHTML += `
        <li class="category-tab" data-category-id="${category}">
          <a class="category-tab" data-category-id="${category}">
            <span class="icon is-small category-tab" data-category-id="${category}">
              <i class="${StoreDbAPI.db.categories[category].icon} category-tab" data-category-id="${category}"></i>
            </span>
            <span class="category-tab" data-category-id="${category}">${StoreDbAPI.db.categories[category].name}</span>
          </a>
        </li>
      `;
    }
    document.querySelector(`.category-tab[data-category-id*="${currentSelectedCategory}"]`).classList.add('is-active');
    sortSelect.dispatchEvent(new Event('change'))

    const totalAppsLabel = document.getElementById('data-total-apps-label')
    totalAppsLabel.innerText = StoreDbAPI.db.apps.len;
    totalAppsLabel.classList.remove('is-danger')
    totalAppsLabel.classList.add('is-success')

    bulmaToast.toast({
      message: i18next.t('data-load-success'),
      type: 'is-success'
    })
  } catch (err) {
    console.error(err);
    bulmaToast.toast({
      message: err,
      type: 'is-danger'
    });
  }
}

reloadButton.onclick = async () => {
  await reloadData();
}