var allApps = {}
const appsListElement = document.getElementById('apps-list')

var appDownloadsModal = {
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

appDownloadsModal.buttons.download.onclick = function (e) {
  window.open(e.target.getAttribute('data-app-download'), '_blank')
}

var appDetailsModal = {
  controller: new BulmaModal('#app-details-modal'),
  content: {
    name: document.getElementById('app-details-modal-app-name'),
    icon: document.getElementById('app-details-modal-app-icon'),
    screenshots: {
      container: document.getElementById('app-details-modal-app-screenshots-container'),
      columns: document.getElementById('app-details-modal-app-screenshots')
    },
    description: document.getElementById('app-details-modal-app-description'),
    categories: document.getElementById('app-details-modal-app-categories'),
    maintainer: document.getElementById('app-details-modal-app-maintainer'),
    version: document.getElementById('app-details-modal-app-version'),
    type: document.getElementById('app-details-modal-app-type'),
    has_ads: document.getElementById('app-details-modal-app-has_ads'),
    has_tracking: document.getElementById('app-details-modal-app-has_tracking'),
    license: document.getElementById('app-details-modal-app-license')
  },
  buttons: {
    download: document.getElementById('app-details-modal-download-button'),
    donation: document.getElementById('app-details-modal-donation-button')
  }
}

appDetailsModal.controller.addEventListener('modal:show', function () {
  document.getElementsByTagName('html')[0].classList.add('is-clipped')
})

appDetailsModal.controller.addEventListener('modal:close', function () {
  document.getElementsByTagName( 'html' )[0].classList.remove('is-clipped')
})

appDetailsModal.buttons.download.onclick = function (e) {
  appDownloadsModal.controller.show()
}

appDetailsModal.buttons.donation.onclick = function (e) {
  window.open(e.target.getAttribute('data-app-donate'), '_blank')
}

function addAppCard (appInfo) {
  appsListElement.appendChild(document.createElement('br'))

  var card = document.createElement('div')
  card.classList.add('card')
  appsListElement.appendChild(card)

  var cardContent = document.createElement('div')
  cardContent.classList.add('card-content')
  card.appendChild(cardContent)

  var media = document.createElement('div')
  media.classList.add('media')
  cardContent.appendChild(media)

  var mediaLeft = document.createElement('div')
  mediaLeft.classList.add('media-left')
  media.appendChild(mediaLeft)

  var figure = document.createElement('figure')
  figure.classList.add('image', 'is-48x48', 'is-unselectable')

  var img = document.createElement('img')
  img.src = appInfo.icon

  figure.appendChild(img)

  mediaLeft.appendChild(figure)

  var mediaContent = document.createElement('div')
  mediaContent.classList.add('media-content')
  media.appendChild(mediaContent)
  
  var mediaContentTitle = document.createElement('p')
  mediaContentTitle.classList.add('title', 'is-4')
  mediaContentTitle.innerText = appInfo.name
  mediaContent.appendChild(mediaContentTitle)

  var mediaContentSubtitle = document.createElement('p')
  mediaContentSubtitle.classList.add('subtitle', 'is-6')
  var readableCategories = ''
  for (const category of appInfo.categories) {
    const categoryFriendlyName = allCategories[category].name
    if (categoryFriendlyName) {
      readableCategories += categoryFriendlyName + ' '
    } else {
      readableCategories += category
    }
  }
  mediaContentSubtitle.innerText = readableCategories
  mediaContent.appendChild(mediaContentSubtitle)

  var content = document.createElement('div')
  content.classList.add('content')
  content.innerText = appInfo.description
  cardContent.appendChild(content)

  var cardFooter = document.createElement('footer')
  cardFooter.classList.add('card-footer')
  card.appendChild(cardFooter)

  var cardFooter_ViewAppDetails = document.createElement('a')
  cardFooter_ViewAppDetails.classList.add('card-footer-item', 'is-unselectable', 'app')
  cardFooter_ViewAppDetails.setAttribute('data-app-categories', appInfo.categories.toString())
  cardFooter_ViewAppDetails.setAttribute('data-app-name', appInfo.name)
  cardFooter_ViewAppDetails.innerText = 'View app details'
  cardFooter.appendChild(cardFooter_ViewAppDetails)
}

function loadAppsFromCategories () {
  document.getElementById('loading-progress').removeAttribute('value')
  appsListElement.innerHTML = ''
  var appsLoaded = []
  for (const category of selectedCategories) {
    for (const app in allApps[category]) {
      if (!appsLoaded.includes(app)) {
        const appDetails = allApps[category][app]
        addAppCard({
          icon: appDetails.icon,
          name: appDetails.name,
          description: appDetails.description,
          categories: appDetails.meta.categories
        })
        appsLoaded.push(appDetails.name)
      }
    }
  }
  document.getElementById('loading-progress').setAttribute('value', 0)
}

appsListElement.onclick = function (e) {
  var targetElementClasses = e.target.classList
  if (targetElementClasses.contains('app')) {
    const appMainCategory = e.target.getAttribute('data-app-categories').split(',')[0]
    if (appMainCategory in allApps) {
      const appDetails = allApps[appMainCategory][e.target.getAttribute('data-app-name')]
      if (appDetails) {
        if (appDetails.name) {
          appDetailsModal.content.name.innerText = appDetails.name
          appDownloadsModal.content.name.innerText = appDetails.name
        } else {
          appDetailsModal.content.name.innerText = 'Unknown app name'
          appDownloadsModal.content.name.innerText = 'Unknown app name'
        }
        
        if (appDetails.icon) {
          appDetailsModal.content.icon.src = appDetails.icon
          appDownloadsModal.content.icon.src = appDetails.icon
        } else {
          appDetailsModal.content.icon.src = 'icons/default-icon.png'
          appDownloadsModal.content.icon.src = 'icons/default-icon.png'
        }
        
        if (appDetails.screenshots) {
          appDetailsModal.content.screenshots.container.style.display = 'initial'
          appDetailsModal.content.screenshots.columns.innerHTML = ''
          for (var screenshot of appDetails.screenshots) {
            var screenshotContainer = document.createElement('div')
            screenshotContainer.classList.add('column', 'is-half')
            appDetailsModal.content.screenshots.columns.appendChild(screenshotContainer)

            var screenshotImage = document.createElement('img')
            screenshotImage.src = screenshot
            screenshotContainer.appendChild(screenshotImage)
          }
        } else {
          appDetailsModal.content.screenshots.container.style.display = 'none'
        }

        if (appDetails.description) {
          appDetailsModal.content.description.innerText = appDetails.description
        } else {
          appDetailsModal.content.description.innerText = 'No description.'
        }

        if (appDetails.meta.categories) {
          var readableCategories = ''
          for (const category of appDetails.meta.categories) {
            const categoryFriendlyName = allCategories[category].name
            if (categoryFriendlyName) {
              readableCategories += categoryFriendlyName + ' '
            } else {
              readableCategories += category
            }
          }
          appDetailsModal.content.categories.innerHTML = 'Categories: <b>' + readableCategories + '</b>'
        } else {
          appDetailsModal.content.categories.innerHTML = 'Categories: <b>unknown</b>'
        }

        if (appDetails.author) {
          appDetailsModal.content.maintainer.innerHTML = 'Author(s): <b>' + appDetails.author + '</b>'
        } else if (appDetails.maintainer) {
          appDetailsModal.content.maintainer.innerHTML = 'Maintainer(s): <b>' + appDetails.maintainer + '</b>'
        } else {
          appDetailsModal.content.maintainer.innerHTML = 'Authors/maintainers: <b>unknown</b>'
        }

        if (appDetails.download.version) {
          appDetailsModal.content.version.innerHTML = 'Version: <b>' + appDetails.download.version + '</b>'
        } else {
          appDetailsModal.content.version.innerHTML = 'Version: <b>unknown</b>'
        }

        if (appDetails.type) {
          appDetailsModal.content.type.innerHTML = 'Type: <b>' + appDetails.type + '</b>'
        } else {
          appDetailsModal.content.type.innerHTML = 'Type: <b>unknown</b>'
        }

        if (typeof(appDetails.has_ads) !== 'undefined') {
          appDetailsModal.content.has_ads.innerHTML = 'Ads: <b>' + appDetails.has_ads + '</b>'
        } else {
          appDetailsModal.content.has_ads.innerHTML = 'Ads: <b>unknown</b>'
        }

        if (typeof(appDetails.has_tracking) !== 'undefined') {
          appDetailsModal.content.has_tracking.innerHTML = 'Tracking: <b>' + appDetails.has_tracking + '</b>'
        } else {
          appDetailsModal.content.has_tracking.innerHTML = 'Tracking: <b>unknown</b>'
        }

        if (appDetails.license) {
          appDetailsModal.content.license.innerHTML = 'License: <b>' + appDetails.license + '</b>'
        } else {
          appDetailsModal.content.license.innerHTML = 'License: <b>unknown</b>'
        }

        if (appDetails.download.url) {
          appDetailsModal.buttons.download.style.display = 'initial'
          appDetailsModal.buttons.download.setAttribute('data-app-download', appDetails.download.url)
          appDownloadsModal.buttons.download.style.display = 'initial'
          appDownloadsModal.buttons.download.setAttribute('data-app-download', appDetails.download.url)
          appDownloadsModal.content.qrcode.innerHTML = ''
          new QRCode(appDownloadsModal.content.qrcode, appDetails.download.url)
        } else {
          appDetailsModal.buttons.download.style.display = 'none'
          appDownloadsModal.buttons.download.style.display = 'none'
        }

        if (appDetails.donation) {
          appDetailsModal.buttons.donation.style.display = 'initial'
          appDetailsModal.buttons.donation.setAttribute('data-app-donate', appDetails.donation)
        } else {
          appDetailsModal.buttons.donation.style.display = 'none'
        }

        appDetailsModal.controller.show()
      } else {
        bulmaToast.toast({
          message: 'App does not exist in category "' + appMainCategory + '"!',
          type: "is-danger",
          position: "top-right",
          closeOnClick: true,
          pauseOnHover: true,
          animate: toastAnimateOptions
        })
      }
    } else {
      bulmaToast.toast({
        message: 'Given category "' + appMainCategory + '" does not exist!',
        type: "is-danger",
        position: "top-right",
        closeOnClick: true,
        pauseOnHover: true,
        animate: toastAnimateOptions
      })
    }
  }
}
