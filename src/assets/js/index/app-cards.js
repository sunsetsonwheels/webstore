'use strict';

var appCardColumn = 0;

const appCardsColumnElements = [
  document.getElementById('app-cards-column-0'),
  document.getElementById('app-cards-column-1'),
  document.getElementById('app-cards-column-2')
];

function addAppCard (appDetails) {
  appCardsColumnElements[appCardColumn].innerHTML += `
    <br>
    <div id="${appDetails.slug}" class="card">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48 is-unselectable">
              <img src="${appDetails.icon}" alt="${appDetails.name}">
            </figure>
          </div>
          <div class="media-content">
            <h1 class="title is-4 is-clamped">${appDetails.name}</h1>
            <h3 class="subtitle is-6 is-clamped">${generateReadableCategories(appDetails.meta.categories)}</h2>
          </div>
        </div>
        <div class="content is-clamped">${appDetails.description}</div>
      </div>
      <footer class="card-footer">
        <a class="card-footer-item is-unselectable app-details i18n"
           data-app-name="${appDetails.name}"
           data-i18n="info">
          ${i18next.t("info")}
        </a>
        <a class="card-footer-item is-unselectable app-download i18n"
           data-app-name="${appDetails.name}"
           data-i18n="download">
           ${i18next.t("download")}
        </a>
        <a class="card-footer-item is-unselectable app-share i18n"
           data-app-slug="${appDetails.slug}"
           data-i18n="share">
          ${i18next.t("share")}
        </a>
      </footer>
    </div>
  `;

  appCardColumn++;
  if (appCardColumn > appCardsColumnElements.length - 1) {
    appCardColumn = 0
  }
}

async function shareApp(shareURL) {
  if (navigator.share) {
    try {
      await navigator.share({
        url: shareURL
      });
    } catch (err) {
      console.error(err);
    }
  } else if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareURL);
      bulmaToast.toast({
        message: i18next.t('copy-to-clipboard-success'),
        type: 'is-success'
      })
    } catch (err) {
      console.err(err);
    }
  }
}

const appCardsContainerElement = document.getElementById('app-cards-container')
appCardsContainerElement.onclick = async (e) => {
  const targetElementClasses = e.target.classList
  if (targetElementClasses.contains('app-details')) {
    setAppDetailsModalDetails(StoreDbAPI.db.apps.objects[e.target.getAttribute('data-app-name')]);
    appDetailsModal.controller.show();
  } else if (targetElementClasses.contains("app-download")) {
    setAppDownloadModalDetails(StoreDbAPI.db.apps.objects[e.target.getAttribute('data-app-name')]);
    appDownloadsModal.controller.show();
  } else if (targetElementClasses.contains("app-share")) {
    await shareApp(`${window.location.origin}/#${e.target.getAttribute("data-app-slug")}`);
  }
}