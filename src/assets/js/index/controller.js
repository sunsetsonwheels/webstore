'use strict'

const toastAnimateOptions = { in: "bounceInDown", out: "bounceOutUp" }

var currentSelectedCategory = "all"

var StoreDbAPI = new StoreDatabaseAPI()

var isFirstInitCompleted = false
var currentWebStoreVersion = ''

function separateArrayCommas (array) {
  var separated = ''
  const arrayLength = array.length
  for (const index in array) {
    if (index + 1 < arrayLength) {
      separated += array[index] + ', '
    } else {
      separated += array[index] + ' '
    }
  }
  return separated
}

function generateReadableCategories (categories) {
  var rawCategories = []
  for (const index in categories) {
    const categoryRawName = categories[index]
    const categoryFriendlyName = StoreDbAPI.db.categories[categoryRawName].name
    if (categoryFriendlyName) {
      rawCategories.push(categoryFriendlyName)
    } else {
      rawCategories.push(categoryRawName)
    }
  }
  return separateArrayCommas(rawCategories)
}

function listAppsByCategory (category, sort) {
  return StoreDbAPI.sortApps(StoreDbAPI.getAppsByCategory(category), sort)
}

function reloadAppRatings (appID) {
  appDetailsModal.content.ratings.loggedIn.points.value = 1
  appDetailsModal.content.ratings.loggedIn.description.value = ''
  appDetailsModal.content.ratings.loggedIn.points.disabled = true
  appDetailsModal.content.ratings.loggedIn.description.disabled = true
  appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add('is-hidden')
  appDetailsModal.content.ratings.loggedIn.submitButton.classList.add('is-loading')
  appDetailsModal.content.ratings.loggedIn.submitButton.disabled = true
  appDetailsModal.content.ratings.allRatings.innerHTML = 'Loading ratings... <br>'
  StoreDbAPI.getAppRatings(appID).then(function (returnMessage) {
    appDetailsModal.content.ratings.allRatings.innerHTML = ''

    var isPersonalReviewExists = false

    if (returnMessage.response.data.average) {
      var averageRatingElement = document.createElement('h3')
      averageRatingElement.classList.add('title', 'is-6', 'is-unselectable')
      averageRatingElement.innerText = `Average points rating: ${returnMessage.response.data.average} points`
      appDetailsModal.content.ratings.allRatings.appendChild(averageRatingElement)
      averageRatingElement.appendChild(document.createElement('hr'))
    }
    for (const review of returnMessage.response.data.ratings) {
      if (review.username == userDetails.username) {
        appDetailsModal.content.ratings.loggedIn.points.disabled = false
        appDetailsModal.content.ratings.loggedIn.description.disabled = false
        appDetailsModal.content.ratings.loggedIn.points.value = review.points
        appDetailsModal.content.ratings.loggedIn.description.value = review.description
        appDetailsModal.content.ratings.loggedIn.points.disabled = true
        appDetailsModal.content.ratings.loggedIn.description.disabled = true
        isPersonalReviewExists = true
      } else {
        var ratingCardElement = document.createElement('div')
        ratingCardElement.classList.add('card')
        appDetailsModal.content.ratings.allRatings.appendChild(ratingCardElement)
        appDetailsModal.content.ratings.allRatings.appendChild(document.createElement('br'))

        var ratingCardContentElement = document.createElement('div')
        ratingCardContentElement.classList.add('card-content')
        ratingCardElement.appendChild(ratingCardContentElement)

        var ratingDescriptionElement = document.createElement('p')
        ratingDescriptionElement.classList.add('title', 'is-5')
        ratingDescriptionElement.innerText = review.description
        ratingCardContentElement.appendChild(ratingDescriptionElement)

        var ratingInfoElement = document.createElement('p')
        ratingInfoElement.classList.add('subtitle', 'is-6')
        ratingInfoElement.innerText = `${review.username} • ${review.points} points • ${new Date(review.creationtime)}`
        ratingCardContentElement.appendChild(ratingInfoElement)
      }
    }

    appDetailsModal.content.ratings.loggedIn.submitButton.setAttribute('data-app-appid', appID)
    if (isPersonalReviewExists) {
      appDetailsModal.content.ratings.loggedIn.points.disabled = true
      appDetailsModal.content.ratings.loggedIn.description.disabled = true
      appDetailsModal.content.ratings.loggedIn.submitButton.disabled = true
    } else {
      appDetailsModal.content.ratings.loggedIn.points.disabled = false
      appDetailsModal.content.ratings.loggedIn.description.disabled = false
      appDetailsModal.content.ratings.loggedIn.submitButton.disabled = false
    }
    appDetailsModal.content.ratings.loggedIn.submitButton.classList.remove('is-loading')
    var noMoreRatingsElement = document.createElement('span')
    noMoreRatingsElement.classList.add('title', 'is-6')
    noMoreRatingsElement.innerText = 'No more ratings.'
    appDetailsModal.content.ratings.allRatings.appendChild(noMoreRatingsElement)
    appDetailsModal.content.ratings.allRatings.appendChild(document.createElement('hr'))
  }).catch(function (err) {
    bulmaToast.toast({
      message: 'Ratings could not be loaded! Check the console for more info.',
      type: "is-danger"
    })
    console.error(err)
  })
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
  StoreDbAPI.dlCountApp(e.target.getAttribute('data-app-appid')).then(function () {
    e.target.disabled = false
    e.target.classList.remove('is-loading')
  }).catch(function () {
    e.target.disabled = false
    e.target.classList.remove('is-loading')
    bulmaToast.toast({
      message: 'Failed to record download count! Check the console for more info.',
      type: 'is-danger'
    })
  })
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
    descriptionSeparator: document.getElementById('app-details-modal-description-separator'),
    description: document.getElementById('app-details-modal-app-description'),
    categories: document.getElementById('app-details-modal-app-categories'),
    maintainer: document.getElementById('app-details-modal-app-maintainer'),
    version: document.getElementById('app-details-modal-app-version'),
    type: document.getElementById('app-details-modal-app-type'),
    has_ads: document.getElementById('app-details-modal-app-has_ads'),
    has_tracking: document.getElementById('app-details-modal-app-has_tracking'),
    license: document.getElementById('app-details-modal-app-license'),
    downloadCount: document.getElementById('app-details-modal-app-downloadCount'),
    ratings: {
      notLoggedIn: document.getElementById('app-details-modal-app-ratings-not-logged-in'),
      loggedIn: {
        container: document.getElementById('app-details-modal-app-ratings-logged-in'),
        points: document.getElementById('app-details-modal-app-ratings-logged-in-points'),
        description: document.getElementById('app-details-modal-app-ratings-logged-in-description'),
        ratingIncompleteBlurb: document.getElementById('app-details-modal-rating-incomplete-blurb'),
        submitButton: document.getElementById('app-details-modal-app-ratings-logged-in-submit-button')
      },
      allRatings: document.getElementById("app-details-modal-app-ratings-all-ratings")
    }
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

appDetailsModal.buttons.download.onclick = function () {
  appDownloadsModal.controller.show()
}

appDetailsModal.buttons.donation.onclick = function (e) {
  window.open(e.target.getAttribute('data-app-donate'), '_blank')
}

appDetailsModal.content.ratings.loggedIn.submitButton.onclick = function (e) {
  appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add('is-hidden')
  if (appDetailsModal.content.ratings.loggedIn.description.value.length > 2 && isUserLoggedIn) {
    e.target.classList.add('is-loading')
    e.target.disabled = true
    appDetailsModal.content.ratings.loggedIn.points.disabled = true
    appDetailsModal.content.ratings.loggedIn.description.disabled = true
    StoreDbAPI.addNewRating(
      userDetails.username, 
      userDetails.logintoken, 
      e.target.getAttribute('data-app-appid'), 
      appDetailsModal.content.ratings.loggedIn.points.value,
      appDetailsModal.content.ratings.loggedIn.description.value
    ).then(function () {
      setTimeout(function () {
        reloadAppRatings(e.target.getAttribute('data-app-appid'))
      }, 2000)
    }).catch(function () {
      setTimeout(function () {
        reloadAppRatings(e.target.getAttribute('data-app-appid'))
      }, 2000)
    })
  } else {
    appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.remove('is-hidden')
  }
}

var appCardColumn = 0
var appCardsColumnElements = [
  document.getElementById('app-cards-column-0'),
  document.getElementById('app-cards-column-1')
]

var appCardsContainerElement = document.getElementById('app-cards-container')
appCardsContainerElement.onclick = function (e) {
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
        
        if (appDetails.screenshots.length > 0) {
          appDetailsModal.content.screenshots.container.style.display = 'initial'
          appDetailsModal.content.screenshots.columns.innerHTML = ''
          for (var screenshot of appDetails.screenshots) {
            var screenshotContainer = document.createElement('div')
            screenshotContainer.classList.add('column', 'is-half')
            appDetailsModal.content.screenshots.columns.appendChild(screenshotContainer)

            var screenshotImage = document.createElement('img')
            screenshotImage.src = screenshot
            screenshotContainer.appendChild(screenshotImage)
            appDetailsModal.content.descriptionSeparator.classList.remove('is-hidden')
          }
        } else {
          appDetailsModal.content.screenshots.container.style.display = 'none'
          appDetailsModal.content.descriptionSeparator.classList.add('is-hidden')
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
          if (typeof appDetails.author == "string") {
            appDetailsModal.content.maintainer.innerHTML = 'Author(s): <b>' + appDetails.author + '</b>'
          } else if (Array.isArray(appDetails.author)) {
            appDetailsModal.content.maintainer.innerHTML = 'Author(s): <b>' + separateArrayCommas(appDetails.author) + '</b>'
          }
        } else if (appDetails.maintainer) {
          if (typeof appDetails.maintainer == "string") {
            appDetailsModal.content.maintainer.innerHTML = 'Maintainer(s): <b>' + appDetails.maintainer + '</b>'
          } else if (Array.isArray(appDetails.maintainer)) {
            appDetailsModal.content.maintainer.innerHTML = 'Maintainer(s): <b>' + separateArrayCommas(appDetails.maintainer) + '</b>'
          }
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

        reloadAppRatings(appDetails.slug)

        if (appDetails.download.url) {
          appDetailsModal.buttons.download.style.display = 'initial'
          appDetailsModal.buttons.download.setAttribute('data-app-download', appDetails.download.url)
          appDownloadsModal.buttons.download.style.display = 'initial'
          appDownloadsModal.buttons.download.setAttribute('data-app-download', appDetails.download.url)
          appDownloadsModal.buttons.download.setAttribute('data-app-appid', appDetails.slug)
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

        if (isUserLoggedIn) {
          appDetailsModal.content.ratings.notLoggedIn.classList.add('is-hidden')
          appDetailsModal.content.ratings.loggedIn.container.classList.remove('is-hidden')
        } else {
          appDetailsModal.content.ratings.loggedIn.container.classList.add('is-hidden')
          appDetailsModal.content.ratings.notLoggedIn.classList.remove('is-hidden')
        }

        appDetailsModal.controller.show()
      } else {
        bulmaToast.toast({
          message: 'App does not exist in category "' + appMainCategory + '"!',
          type: 'is-danger'
        })
      }
    } else {
      bulmaToast.toast({
        message: 'Given category "' + appMainCategory + '" does not exist!',
        type: 'is-danger'
      })
    }
  } else if (targetElementClasses.contains('share')) {
    var linkGhost = document.getElementById('link-ghost')
    linkGhost.innerText = window.location
    linkGhost.select()
    document.execCommand('copy')
    bulmaToast.toast({
      message: 'Copied sharable link to clipboard!',
      type: 'is-success'
    })
  }
}

function addAppCard (appDetails) {
  appCardsColumnElements[appCardColumn].appendChild(document.createElement('br'))

  var card = document.createElement('div')
  card.classList.add('card')
  card.id = appDetails.slug
  appCardsColumnElements[appCardColumn].appendChild(card)

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
  img.src = appDetails.icon

  figure.appendChild(img)

  mediaLeft.appendChild(figure)

  var mediaContent = document.createElement('div')
  mediaContent.classList.add('media-content')
  media.appendChild(mediaContent)
  
  var mediaContentTitle = document.createElement('p')
  mediaContentTitle.classList.add('title', 'is-4')
  mediaContentTitle.innerText = appDetails.name
  mediaContent.appendChild(mediaContentTitle)

  var mediaContentSubtitle = document.createElement('p')
  mediaContentSubtitle.classList.add('subtitle', 'is-6')
  mediaContentSubtitle.innerText = generateReadableCategories(appDetails.meta.categories)
  mediaContent.appendChild(mediaContentSubtitle)

  var content = document.createElement('div')
  content.classList.add('content')
  content.innerText = appDetails.description
  cardContent.appendChild(content)

  var cardFooter = document.createElement('footer')
  cardFooter.classList.add('card-footer')
  card.appendChild(cardFooter)

  var cardFooter_ViewAppDetails = document.createElement('a')
  cardFooter_ViewAppDetails.classList.add('card-footer-item', 'is-unselectable', 'app')
  cardFooter_ViewAppDetails.setAttribute('data-app-categories', appDetails.meta.categories.toString())
  cardFooter_ViewAppDetails.setAttribute('data-app-name', appDetails.name)
  cardFooter_ViewAppDetails.innerText = 'View app details'
  cardFooter.appendChild(cardFooter_ViewAppDetails)

  var cardFooter_ShareApp = document.createElement('a')
  cardFooter_ShareApp.classList.add('card-footer-item', 'is-unselectable', 'share')
  cardFooter_ShareApp.href = '#' + appDetails.slug
  cardFooter_ShareApp.innerText = 'Copy link to app'
  cardFooter.appendChild(cardFooter_ShareApp)

  switch (appCardColumn) {
    case 0:
      appCardColumn = 1
      break
    case 1:
      appCardColumn = 0
      break
  }
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

  for (var appCardColumnElement of appCardsColumnElements) {
    appCardColumnElement.innerHTML = ''
  }

  appCardColumn = 0

  listAppsByCategory(currentSelectedCategory, e.target.value).then(function (appDetails) {
    for (const app in appDetails) {
      addAppCard(appDetails[app])
    }
    reloadButton.classList.remove('is-loading')
    sortSelect.disabled = false
    reloadButton.disabled = false

    try {
      const appSlug = window.location.hash.split("#")[1]
      if (typeof appSlug !== 'undefined') {
        window.location.hash = appSlug
      } else {
        window.location.hash = ''
      }
    } catch (err) {
      window.location.hash = ''
    }

    bulmaToast.toast({
      message: 'Apps sorted successfully!',
      type: "is-success"
    })
  }).catch(function (err) {
    reloadButton.classList.remove('is-loading')
    sortSelect.disabled = false
    reloadButton.disabled = false

    bulmaToast.toast({
      message: 'Apps could not be sorted! Check the console for more info.',
      type: "is-danger"
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

var userDetails = {
  username: null,
  logintoken: null
}

var userModal = {
  controller: new BulmaModal('#user-modal'),
  content: {
    usernameInput: document.getElementById('user-modal-username-input'),
    logintokenInput: document.getElementById('user-modal-logintoken-input'),
    loginFailedBlurb: document.getElementById('user-modal-login-failed-blurb'),
    saveLoginCheckbox: document.getElementById('user-modal-save-login-checkbox')
  },
  buttons: {
    login: document.getElementById('user-modal-login-button')
  }
}

userModal.controller.addEventListener('modal:show', function () {
  var isLoginDetailsSaved = false

  const username = localStorage.getItem('webstore-ratings-username')
  if (username !== null) {
    userModal.content.usernameInput.value = username
    isLoginDetailsSaved = true
  } else {
    userModal.content.usernameInput.value = ''
  }

  const logintoken = localStorage.getItem('webstore-ratings-logintoken')
  if (logintoken !== null) {
    userModal.content.logintokenInput.value = logintoken
    isLoginDetailsSaved = true
  } else {
    userModal.content.logintokenInput.value = ''
  }

  if (isLoginDetailsSaved) {
    userModal.content.saveLoginCheckbox.checked = true
  }
})

userModal.controller.addEventListener('modal:close', function () {
  userModal.content.loginFailedBlurb.classList.add('is-hidden')
})

var isUserLoggedIn = false

var userButton = {
  button: document.getElementById('user-button'),
  icon: document.getElementById('user-icon'),
  text: document.getElementById('user-button-text')
}

userButton.button.onclick = function () {
  if (isUserLoggedIn) {
    userDetails.username = null,
    userDetails.logintoken = null
    userButton.button.classList.remove('is-danger')
    userButton.button.classList.add('is-link')
    userButton.text.innerText = 'Login'
    userButton.icon.classList.add('fa-user')
    userButton.icon.classList.remove('fa-sign-out-alt')
    isUserLoggedIn = false
  } else {
    userModal.controller.show()
  }
}

function loginSuccessCb () {
  userModal.content.usernameInput.disabled = false
  userModal.content.logintokenInput.disabled = false
  userModal.buttons.login.disabled = false
  userModal.buttons.login.classList.remove('is-loading')
  userButton.button.classList.remove('is-link')
  userButton.button.classList.add('is-danger')
  userButton.text.innerText = 'Log out'
  userButton.icon.classList.add('fa-sign-out-alt')
  userButton.icon.classList.remove('fa-user')
  userModal.controller.close()
  isUserLoggedIn = true
}

userModal.buttons.login.onclick = function () {
  userModal.buttons.login.classList.add('is-loading')
  userModal.buttons.login.disabled = true
  userModal.content.loginFailedBlurb.classList.add('is-hidden')
  userDetails.username = userModal.content.usernameInput.value
  userDetails.logintoken = userModal.content.logintokenInput.value
  userModal.content.usernameInput.disabled = true
  userModal.content.logintokenInput.disabled = true
  StoreDbAPI.loginToRatingsAccount(userDetails.username, userDetails.logintoken).then(function (e) {
    loginSuccessCb()
  }).catch(function (err) {
    StoreDbAPI.createRatingsAccount(userDetails.username, userDetails.logintoken).then(function (e) {
      loginSuccessCb()
    }).catch(function (err2) {
      userModal.content.usernameInput.disabled = false
      userModal.content.logintokenInput.disabled = false
      userModal.buttons.login.disabled = false
      userModal.buttons.login.classList.remove('is-loading')
      userModal.content.loginFailedBlurb.classList.remove('is-hidden')
      console.error(err)
    })
  })
}

userModal.content.saveLoginCheckbox.onchange = function (e) {
  if (e.target.checked) {
    localStorage.setItem('webstore-ratings-username', userModal.content.usernameInput.value)
    localStorage.setItem('webstore-ratings-logintoken', userModal.content.logintokenInput.value)
  } else {
    localStorage.removeItem('webstore-ratings-username')
    localStorage.removeItem('webstore-ratings-logintoken')
  }
}

var updateModal = {
  controller: new BulmaModal('#webstore-update-modal'),
  buttons: {
    update: document.getElementById('webstore-update-modal-update-button'),
  }
}

updateModal.buttons.update.onclick = function () {
  location.reload()
}

function reloadData () {
  sortSelect.disabled = true
  reloadButton.classList.add('is-loading')
  reloadButton.disabled = true

  var githubCommitLabel = document.getElementById('webstore-github-commit-label')
  githubCommitLabel.classList.remove('is-danger')

  categoriesTabsElement.innerHTML = ''

  for (var appCardColumnElement of appCardsColumnElements) {
    appCardColumnElement.innerHTML = ''
  }

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

    var totalAppsLabel = document.getElementById('data-total-apps-label')
    totalAppsLabel.innerText = data.apps.raw.length
    totalAppsLabel.classList.remove('is-danger')
    totalAppsLabel.classList.add('is-success')

    var githubCommitWorker = new Worker('assets/js/index/workers/githubcommit-worker.js')
    githubCommitWorker.onmessage = function (e) {
      githubCommitWorker.terminate()
      if (e.data !== null) {
        githubCommitLabel.innerText = e.data.substring(0, 7)
        githubCommitLabel.setAttribute('href', 'https://github.com/jkelol111/webstore/blob/' + e.data + '/src/')
        githubCommitLabel.classList.remove('is-danger')
        githubCommitLabel.classList.add('is-success')

        if (!isFirstInitCompleted) {
          currentWebStoreVersion = e.data
          isFirstInitCompleted = true
        }

        if (e.data !== currentWebStoreVersion) {
          updateModal.controller.show()
        }
      }
    }
    githubCommitWorker.postMessage(null)

    bulmaToast.toast({
      message: 'Data loaded successfully!',
      type: "is-success"
    })
  }).catch(function (err) {
    bulmaToast.toast({
      message: 'Data could not be loaded! Check the console for more info.',
      type: "is-danger"
    })
    console.error(err)
  })
}

reloadButton.onclick = function () {
  reloadData()
}

reloadData()
