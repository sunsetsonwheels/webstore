'use strict'

const toastAnimateOptions = { in: "bounceInDown", out: "bounceOutUp" }

var currentSelectedCategory = "all"

var StoreDbAPI = new StoreDatabaseAPI()

function generateReadableCategories (categories) {
  var readableCategories = ''
  const categoriesLength = categories.length
  for (const categoryIndex in categories) {
    const categoryRawName = categories[categoryIndex]
    const categoryFriendlyName = StoreDbAPI.db.categories[categoryRawName].name
    if (categoryIndex + 1 < categoriesLength) {
      if (categoryFriendlyName) {
        readableCategories += categoryFriendlyName + ', '
      } else {
        readableCategories += categoryRawName + ', '
      }
    } else {
      if (categoryFriendlyName) {
        readableCategories += categoryFriendlyName + ' '
      } else {
        readableCategories += categoryRawName
      }
    }
  }
  return readableCategories
}

function listAppsByCategory (category, sort) {
  return StoreDbAPI.sortApps(StoreDbAPI.getAppsByCategory(category), sort)
}

function addAppCard (appInfo) {
  appsListElement.appendChild(document.createElement('br'))

  var card = document.createElement('div')
  card.classList.add('card')
  card.id = appInfo.slug
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
  mediaContentSubtitle.innerText = generateReadableCategories(appInfo.meta.categories)
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
  cardFooter_ViewAppDetails.setAttribute('data-app-categories', appInfo.meta.categories.toString())
  cardFooter_ViewAppDetails.setAttribute('data-app-name', appInfo.name)
  cardFooter_ViewAppDetails.innerText = 'View app details'
  cardFooter.appendChild(cardFooter_ViewAppDetails)

  var cardFooter_ShareApp = document.createElement('a')
  cardFooter_ShareApp.classList.add('card-footer-item', 'is-unselectable', 'share')
  cardFooter_ShareApp.href = '#' + appInfo.slug
  cardFooter_ShareApp.innerText = 'Copy link to app'
  cardFooter.appendChild(cardFooter_ShareApp)
}

document.getElementById('scrolltop-fab').onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

var reloadButton = document.getElementById('reload-button')

var sortSelect = document.getElementById('sort-select')
sortSelect.onchange = function (e) {
  reloadButton.classList.add('is-loading')

  var sortIcon = document.getElementById('sort-icon')
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

  sortSelect.disabled = true
  reloadButton.disabled = true

  appsListElement.innerHTML = ''

  listAppsByCategory(currentSelectedCategory, e.target.value).then(function (appDetails) {
    for (const app in appDetails) {
      addAppCard(appDetails[app])
    }
    reloadButton.classList.remove('is-loading')
    sortSelect.disabled = false
    reloadButton.disabled = false

    bulmaToast.toast({
      message: 'Apps sorted successfully!',
      type: "is-success",
      position: "top-center",
      closeOnClick: true,
      pauseOnHover: true,
      animate: toastAnimateOptions
    })
  }).catch(function (err) {
    reloadButton.classList.remove('is-loading')
    sortSelect.disabled = false
    reloadButton.disabled = false

    bulmaToast.toast({
      message: 'Apps could not be sorted! Check the console for more info.',
      type: "is-danger",
      position: "top-center",
      closeOnClick: true,
      pauseOnHover: true,
      animate: toastAnimateOptions
    })

    console.log(err)
  })
}

var categoriesTabsElement = document.getElementById('categories-tabs')
categoriesTabsElement.onclick = function (e) {
  const targetElementClasses = e.target.classList
  if (targetElementClasses.contains('category-link') || targetElementClasses.contains('category-tab'))  {
    currentSelectedCategory = e.target.getAttribute('data-category-id')
    if (currentSelectedCategory in StoreDbAPI.db.categories) {
      for (const categoryTabElement of document.querySelectorAll('.category-tab')) {
        if (categoryTabElement.getAttribute('data-category-id') === currentSelectedCategory) {
          categoryTabElement.classList.add('is-active')
        } else {
          categoryTabElement.classList.remove('is-active')
        }
      }
      sortSelect.dispatchEvent(new Event('change'))
    }
  }
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
    license: document.getElementById('app-details-modal-app-license'),
    downloadCount: document.getElementById('app-details-modal-app-downloadCount')
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
  e.target.classList.add('is-loading')
  e.target.disabled = true
  StoreDbAPI.dlCountApp(e.target.getAttribute('data-app-slug')).then(function () {
    e.target.disabled = false
    e.target.classList.remove('is-loading')
    window.open(e.target.getAttribute('data-app-download'), '_blank')
  }).catch(function () {
    e.target.disabled = false
    e.target.classList.remove('is-loading')
    bulmaToast.toast({
      message: 'Failed to record download count! Check the console for more info.',
      type: 'is-danger',
      position: 'top-center',
      closeOnClick: true,
      closeOnHover: true,
      animate: toastAnimateOptions
    })
  })
  window.open(e.target.getAttribute('data-app-download'), '_blank')
}

var appsListElement = document.getElementById('apps-list')
appsListElement.onclick = function (e) {
  var targetElementClasses = e.target.classList
  if (targetElementClasses.contains('app')) {
    const appMainCategory = e.target.getAttribute('data-app-categories').split(',')[0]
    if (appMainCategory in StoreDbAPI.db.apps.categorical) {
      const appDetails = StoreDbAPI.db.apps.categorical[appMainCategory][e.target.getAttribute('data-app-name')]
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
          appDetailsModal.content.categories.innerHTML = 'Categories: <b>' + generateReadableCategories(appDetails.meta.categories) + '</b>'
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

        if (StoreDbAPI.db.apps.downloadCounts[appDetails.slug]) {
          appDetailsModal.content.downloadCount.innerHTML = 'Downloads: <b>' + StoreDbAPI.db.apps.downloadCounts[appDetails.slug] + '</b>'
        } else {
          appDetailsModal.content.downloadCount.innerHTML = 'Downloads: <b>unknown</b>'
        }

        if (appDetails.download.url) {
          appDetailsModal.buttons.download.style.display = 'initial'
          appDetailsModal.buttons.download.setAttribute('data-app-download', appDetails.download.url)
          appDownloadsModal.buttons.download.style.display = 'initial'
          appDownloadsModal.buttons.download.setAttribute('data-app-download', appDetails.download.url)
          appDownloadsModal.buttons.download.setAttribute('data-app-slug', appDetails.slug)
          appDownloadsModal.content.qrcode.innerHTML = ''
          new QRCode(appDownloadsModal.content.qrcode, "bhackers:" + appDetails.slug)
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
          type: 'is-danger',
          position: 'top-center',
          closeOnClick: true,
          pauseOnHover: true,
          animate: toastAnimateOptions
        })
      }
    } else {
      bulmaToast.toast({
        message: 'Given category "' + appMainCategory + '" does not exist!',
        type: 'is-danger',
        position: 'top-center',
        closeOnClick: true,
        pauseOnHover: true,
        animate: toastAnimateOptions
      })
    }
  } else if (targetElementClasses.contains('share')) {
    var linkGhost = document.getElementById('link-ghost')
    linkGhost.innerText = window.location
    linkGhost.select()
    document.execCommand('copy')
    bulmaToast.toast({
      message: 'Copied sharable link to clipboard!',
      type: 'is-success',
      position: 'top-center',
      closeOnClick: true,
      closeOnHover: true,
      animate: toastAnimateOptions
    })
  }
}

function reloadData () {
  sortSelect.disabled = true
  reloadButton.classList.add('is-loading')
  reloadButton.disabled = true

  categoriesTabsElement.innerHTML = ''
  appsListElement.innerHTML = ''

  StoreDbAPI.loadData().then(function (data) {
    for (const category in data.categories) {
      var newCategoryTab = {
        tab: document.createElement('li'),
        link: {
          container: document.createElement('a'),
          content: {
            icon: {
              container: document.createElement('span'),
              icon: document.createElement('i')
            },
            text: document.createElement('span')
          }
        },
      }
  
      newCategoryTab.tab.setAttribute('data-category-id', category)
      newCategoryTab.tab.classList.add('category-tab')
      categoriesTabsElement.appendChild(newCategoryTab.tab)
  
      newCategoryTab.link.container.setAttribute('data-category-id', category)
      newCategoryTab.link.container.classList.add('category-link')
      newCategoryTab.tab.appendChild(newCategoryTab.link.container)
  
      newCategoryTab.link.content.icon.container.setAttribute('data-category-id', category)
      newCategoryTab.link.content.icon.container.classList.add('icon', 'is-small', 'category-link')
      newCategoryTab.link.container.appendChild(newCategoryTab.link.content.icon.container)
  
      for (var faIconClass of data.categories[category].icon.split(' ')) {
        newCategoryTab.link.content.icon.icon.classList.add(faIconClass)
      }
      newCategoryTab.link.content.icon.icon.classList.add('category-link')
      newCategoryTab.link.content.icon.icon.setAttribute('data-category-id', category)
      newCategoryTab.link.content.icon.container.appendChild(newCategoryTab.link.content.icon.icon)
  
      newCategoryTab.link.content.text.innerText = data.categories[category].name
      newCategoryTab.link.content.text.setAttribute('data-category-id', category)
      newCategoryTab.link.content.text.classList.add('category-link')
      newCategoryTab.link.container.appendChild(newCategoryTab.link.content.text)
    }
    document.querySelector('.category-tab[data-category-id*="all"]').classList.add('is-active')

    sortSelect.dispatchEvent(new Event('change'))

    var dataGeneratedLabel = document.getElementById('data-generated-time-label')
    if (data.generatedAt) {
      dataGeneratedLabel.innerText = (new Date(data.generatedAt))
      dataGeneratedLabel.classList.remove('is-danger')
      dataGeneratedLabel.classList.add('is-success')
    }

    var pageLoadedLabel = document.getElementById('page-loaded-time-label')
    pageLoadedLabel.innerText = (new Date().toString())
    pageLoadedLabel.classList.remove('is-danger')
    pageLoadedLabel.classList.add('is-success')

    bulmaToast.toast({
      message: 'Data loaded successfully!',
      type: "is-success",
      position: "top-center",
      closeOnClick: true,
      pauseOnHover: true,
      animate: toastAnimateOptions
    })
  }).catch(function (err) {
    bulmaToast.toast({
      message: 'Data could not be loaded! Check the console for more info.',
      type: "is-danger",
      position: "top-center",
      closeOnClick: true,
      pauseOnHover: true,
      animate: toastAnimateOptions
    })
    console.error(err)
  })
}

reloadButton.onclick = function () {
  reloadData()
}

reloadData()

var githubCommitWorker = new Worker('assets/js/index/workers/githubcommit-worker.js')
githubCommitWorker.onmessage = function (e) {
  githubCommitWorker.terminate()
  if (e.data !== null) {
    var githubCommitLabel = document.getElementById('webstore-github-commit-label')
    githubCommitLabel.innerText = e.data.substring(0, 7)
    githubCommitLabel.setAttribute('href', 'https://github.com/jkelol111/webstore/blob/' + e.data + '/src/')
    githubCommitLabel.classList.remove('is-danger')
    githubCommitLabel.classList.add('is-success')
  }
}
githubCommitWorker.postMessage(null)
