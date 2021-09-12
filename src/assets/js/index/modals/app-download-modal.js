'use strict';

const appDownloadsModal = {
  controller: new BulmaModal('#app-download-modal'),
  content: {
    name: document.getElementById('app-download-modal-app-name'),
    icon: document.getElementById('app-download-modal-app-icon'),
    qrcode: document.getElementById('app-download-modal-app-download-qrcode')
  },
  buttons: {
    download: document.getElementById('app-download-modal-download-button')
  }
}

appDownloadsModal.buttons.download.onclick = async (e) => {
  e.target.classList.add('is-loading')
  e.target.disabled = true
  try {
    await StoreDbAPI.dlCountApp(e.target.getAttribute("data-app-slug"));
  } catch (err) {
    console.error(err);
    bulmaToast.toast({
      message: err,
      type: 'is-danger'
    });
  }
  e.target.disabled = false;
  e.target.classList.remove("is-loading");
  window.open(e.target.getAttribute('data-app-download'), '_blank')
}

function setAppDownloadModalDetails(appDetails) {
  if (appDetails.name) {
    appDownloadsModal.content.name.innerText = appDetails.name
  } else {
    appDownloadsModal.content.name.innerText = '???';
  }

  if (appDetails.icon) {
    appDownloadsModal.content.icon.src = appDetails.icon;
  } else {
    appDownloadsModal.content.icon.src = 'icons/default-icon.png';
  }

  if (appDetails.download.url) {
    let QRheader = window.localStorage.getItem("QRHeader");
    appDownloadsModal.buttons.download.classList.remove('is-hidden');
    appDownloadsModal.buttons.download.setAttribute('data-app-download', appDetails.download.url);
    appDownloadsModal.buttons.download.setAttribute('data-app-slug', appDetails.slug);
    appDownloadsModal.content.qrcode.innerHTML = '';
    new QRCode(appDownloadsModal.content.qrcode, QRheader + appDetails.slug);
  } else {
    appDownloadsModal.buttons.download.classList.add('is-hidden');
  }
}