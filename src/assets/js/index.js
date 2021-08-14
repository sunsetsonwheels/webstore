'use strict'

// Load localization
i18next.use(i18nextBrowserLanguageDetector).use(I18nextFetchBackend).init({
  supportedLngs: ["en", "vi"],
  fallbackLng: "en",
  backend: {
    loadPath: "assets/i18n/{{lng}}.json"
  }
}).then(async (t) => {
  // Init HTML localization.
  const localize = locI18next.init(i18next, {
    selectorAttr: "data-i18n"
  })

  // Localize every element marked for localization.
  localize(".i18n")

  // Handle hamburger menu button.
  for (const navbarBurger of document.getElementsByClassName('navbar-burger')) {
    navbarBurger.onclick = () => {
      navbarBurger.classList.toggle('is-active');
      document.getElementById(navbarBurger.dataset.target).classList.toggle('is-active');
    }
  }

  // Set default options for toast messages
  bulmaToast.setDefaults({
    position: 'top-center',
    closeOnClick: true,
    pauseOnHover: true,
    animate: {
      in: 'bounceInDown',
      out: 'bounceOutUp'
    }
  });

  let currentSelectedCategory = 'all'

  const StoreDbAPI = new StoreDatabaseAPI()

  let isFirstInitCompleted = false
  let currentWebStoreVersion = 'Unknown'

  function separateArrayCommas (array) {
    let separated = ''
    const arrayLength = array.length
    array.forEach((value, i) => {
      if (i + 1 < arrayLength) {
        separated += value + ', '
      } else {
        separated += value
      }
    })
    return separated
  }

  function generateReadableCategories (categories) {
    const rawCategories = []
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
        message: i18next.t('download-record-error'),
        type: 'is-danger'
      })
    })
    window.open(e.target.getAttribute('data-app-download'), '_blank')
  }
  
  const appDetailsModal = {
    controller: new BulmaModal('#app-details-modal'),
    content: {
      name: document.getElementById('app-details-modal-app-name'),
      icon: document.getElementById('app-details-modal-app-icon'),
      screenshots: {
        container: document.getElementById('app-details-modal-app-screenshots-container'),
        scroller: document.getElementById('app-details-modal-app-screenshots')
      },
      descriptionSeparator: document.getElementById('app-details-modal-description-separator'),
      description: document.getElementById('app-details-modal-app-description'),
      categories: document.getElementById('app-details-modal-app-categories'),
      authors: document.getElementById('app-details-modal-app-authors'),
      maintainers: document.getElementById('app-details-modal-app-maintainers'),
      dependencies: document.getElementById('app-details-modal-app-dependencies'),
      version: document.getElementById('app-details-modal-app-version'),
      type: document.getElementById('app-details-modal-app-type'),
      locales: document.getElementById('app-details-modal-app-locales'),
      has_ads: document.getElementById('app-details-modal-app-has_ads'),
      has_tracking: document.getElementById('app-details-modal-app-has_tracking'),
      license: document.getElementById('app-details-modal-app-license'),
      downloadCount: document.getElementById('app-details-modal-app-downloadCount'),
      ratings: {
        notLoggedIn: document.getElementById('app-details-modal-app-ratings-not-logged-in'),
        loggedIn: {
          container: document.getElementById('app-details-modal-app-ratings-logged-in'),
          details: document.getElementById('app-details-modal-app-ratings-logged-in-details'),
          points: document.getElementById('app-details-modal-app-ratings-logged-in-points'),
          description: document.getElementById('app-details-modal-app-ratings-logged-in-description'),
          ratingIncompleteBlurb: document.getElementById('app-details-modal-rating-incomplete-blurb'),
          submitButton: document.getElementById('app-details-modal-app-ratings-logged-in-submit-button')
        },
        averageRating: document.getElementById('app-details-modal-app-ratings-average-rating'),
        allRatings: document.getElementById('app-details-modal-app-ratings-all-ratings')
      }
    },
    buttons: {
      download: document.getElementById('app-details-modal-download-button'),
      website: document.getElementById('app-details-modal-website-button'),
      repo: document.getElementById('app-details-modal-repo-button'),
      donation: document.getElementById('app-details-modal-donation-button')
    }
  }
  
  appDetailsModal.controller.addEventListener('modal:show', function () {
    document.getElementsByTagName('html')[0].classList.add('is-clipped')
  })
  
  appDetailsModal.controller.addEventListener('modal:close', function () {
    document.getElementsByTagName('html')[0].classList.remove('is-clipped')
  })
  
  appDetailsModal.buttons.download.onclick = function () {
    appDownloadsModal.controller.show()
  }
  
  appDetailsModal.buttons.website.onclick = function (e) {
    window.open(e.target.getAttribute('data-app-website'), '_blank')
  }
  
  appDetailsModal.buttons.repo.onclick = function (e) {
    window.open(e.target.getAttribute('data-app-repo'), '_blank')
  }
  
  appDetailsModal.buttons.donation.onclick = function (e) {
    window.open(e.target.getAttribute('data-app-donate'), '_blank')
  }
  
  appDetailsModal.content.ratings.loggedIn.submitButton.onclick = function () {
    appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add('is-hidden')
    if (appDetailsModal.content.ratings.loggedIn.description.value.length > 2 && isUserLoggedIn) {
      appDetailsModal.content.ratings.loggedIn.submitButton.classList.add('is-loading')
      appDetailsModal.content.ratings.loggedIn.submitButton.disabled = true
      appDetailsModal.content.ratings.loggedIn.points.disabled = true
      appDetailsModal.content.ratings.loggedIn.description.disabled = true
      StoreDbAPI.addNewRating(
        userDetails.username,
        userDetails.logintoken,
        appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute('data-app-appid'),
        appDetailsModal.content.ratings.loggedIn.points.value,
        appDetailsModal.content.ratings.loggedIn.description.value
      ).then(function () {
        setTimeout(function () {
          reloadAppRatings(appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute('data-app-appid'))
        }, 2000)
      }).catch(function () {
        setTimeout(function () {
          reloadAppRatings(appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute('data-app-appid'))
        }, 2000)
      })
    } else {
      appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.remove('is-hidden')
    }
  }

  function reloadAppRatings (appID) {
    appDetailsModal.content.ratings.loggedIn.details.innerHTML = '<strong>@Unknown</strong>'
    appDetailsModal.content.ratings.loggedIn.points.value = 1
    appDetailsModal.content.ratings.loggedIn.description.value = ''
    appDetailsModal.content.ratings.loggedIn.points.disabled = true
    appDetailsModal.content.ratings.loggedIn.description.disabled = true
    appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add('is-hidden')
    appDetailsModal.content.ratings.loggedIn.submitButton.classList.add('is-loading')
    appDetailsModal.content.ratings.loggedIn.submitButton.disabled = true
    appDetailsModal.content.ratings.averageRating.innerText = 'Unknown ★'
    appDetailsModal.content.ratings.allRatings.innerHTML = 'Loading ratings...'
  
    StoreDbAPI.getAppRatings(appID).then(function (ratings) {
      appDetailsModal.content.ratings.allRatings.innerHTML = ''
  
      let isPersonalReviewExists = false
  
      if (ratings.average) {
        appDetailsModal.content.ratings.averageRating.innerText = `${ratings.average.toFixed(1)} ★`
      }
      for (const review of ratings.ratings) {
        if (review.username === userDetails.username) {
          appDetailsModal.content.ratings.loggedIn.details.innerHTML = `<strong>@${review.username}</strong> (you) • <small>${review.creationTime}</small>`
          appDetailsModal.content.ratings.loggedIn.points.disabled = false
          appDetailsModal.content.ratings.loggedIn.description.disabled = false
          appDetailsModal.content.ratings.loggedIn.points.value = review.points
          appDetailsModal.content.ratings.loggedIn.description.value = review.description
          appDetailsModal.content.ratings.loggedIn.points.disabled = true
          appDetailsModal.content.ratings.loggedIn.description.disabled = true
          isPersonalReviewExists = true
        } else {
          const ratingBoxElement = document.createElement('div')
          ratingBoxElement.classList.add('box')
          appDetailsModal.content.ratings.allRatings.appendChild(ratingBoxElement)
  
          const ratingMediaElement = document.createElement('article')
          ratingMediaElement.classList.add('media')
          ratingBoxElement.appendChild(ratingMediaElement)
  
          const ratingMediaContentElement = document.createElement('div')
          ratingMediaContentElement.classList.add('media-content')
          ratingMediaElement.appendChild(ratingMediaContentElement)
  
          const ratingMediaActualContentElement = document.createElement('div')
          ratingMediaActualContentElement.classList.add('content')
          ratingMediaContentElement.appendChild(ratingMediaActualContentElement)
  
          const ratingInfoElement = document.createElement('p')
          ratingInfoElement.innerHTML = `<strong>@${review.username}</strong> • <small>${review.points} ★</small> • <small>${review.creationtime}</small>`
          ratingMediaActualContentElement.appendChild(ratingInfoElement)
  
          const ratingDescriptionElement = document.createElement('p')
          ratingDescriptionElement.innerText = review.description
          ratingMediaActualContentElement.appendChild(ratingDescriptionElement)
        }
      }
  
      appDetailsModal.content.ratings.loggedIn.submitButton.setAttribute('data-app-appid', appID)
      if (isPersonalReviewExists) {
        appDetailsModal.content.ratings.loggedIn.points.disabled = true
        appDetailsModal.content.ratings.loggedIn.description.disabled = true
        appDetailsModal.content.ratings.loggedIn.submitButton.disabled = true
      } else {
        appDetailsModal.content.ratings.loggedIn.details.innerHTML = `<strong>@${userDetails.username}</strong> (you)`
        appDetailsModal.content.ratings.loggedIn.points.disabled = false
        appDetailsModal.content.ratings.loggedIn.description.disabled = false
        appDetailsModal.content.ratings.loggedIn.submitButton.disabled = false
      }
      appDetailsModal.content.ratings.loggedIn.submitButton.classList.remove('is-loading')
    }).catch(function (err) {
      bulmaToast.toast({
        message: i18next.t('rating-load-error'),
        type: 'is-danger'
      })
      console.error(err)
    })
  }

  var appCardColumn = 0
  const appCardsColumnElements = [
    document.getElementById('app-cards-column-0'),
    document.getElementById('app-cards-column-1'),
    document.getElementById('app-cards-column-2')
  ]

  const appCardsContainerElement = document.getElementById('app-cards-container')
  appCardsContainerElement.onclick = function (e) {
    const targetElementClasses = e.target.classList
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
            appDetailsModal.content.screenshots.scroller.innerHTML = ''
            appDetailsModal.content.descriptionSeparator.classList.remove('is-hidden')
            for (const screenshot of appDetails.screenshots) {
              const screenshotImage = document.createElement('img')
              screenshotImage.style.padding = '4px'
              screenshotImage.src = screenshot
              appDetailsModal.content.screenshots.scroller.appendChild(screenshotImage)
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
            appDetailsModal.content.categories.innerText = generateReadableCategories(appDetails.meta.categories)
          } else {
            appDetailsModal.content.categories.innerText = 'Unknown'
          }

          if (appDetails.author) {
            if (typeof appDetails.author === 'string') {
              appDetailsModal.content.authors.innerText = appDetails.author
            } else if (Array.isArray(appDetails.author)) {
              appDetailsModal.content.authors.innerText = separateArrayCommas(appDetails.author)
            }
          } else {
            appDetailsModal.content.authors.innerText = 'Unknown'
          }

          if (appDetails.maintainer) {
            if (typeof appDetails.maintainer === 'string') {
              appDetailsModal.content.maintainers.innerText = appDetails.maintainer
            } else if (Array.isArray(appDetails.maintainer)) {
              appDetailsModal.content.maintainers.innerText = separateArrayCommas(appDetails.maintainer)
            }
          } else {
            appDetailsModal.content.maintainers.innerText = 'Unknown'
          }

          if (appDetails.dependencies) {
            appDetailsModal.content.dependencies.innerHTML = ""
            if (typeof appDetails.dependencies.length > 0) {
              for (let i = 0; i < appDetails.dependencies.length; i++) {
                if (appDetails.dependencies[i].hasOwnProperty("url")) {
                  appDetailsModal.content.dependencies.innerHTML = '<a href="' + appDetails.dependencies[i].url + '" target="_blank">' + appDetails.dependencies[i].name + '</a>'
                } else {
                  appDetailsModal.content.dependencies.innerHTML = appDetails.dependencies[i].name
                }
              }
            } else if (appDetails.dependencies.length === 0){
              appDetailsModal.content.dependencies.innerText = '(None)'
            } else if (Array.isArray(appDetails.dependencies)) {
              appDetails.dependencies.forEach((depend) => {
                if (depend.url === "") {
                  appDetailsModal.content.dependencies.innerHTML += depend.name + '&nbsp;'
                } else {
                  appDetailsModal.content.dependencies.innerHTML += '<a href="' + depend.url + '" target="_blank">' + depend.name + '</a>&nbsp;'
                }
              });
            }
          } else {
            appDetailsModal.content.dependencies.innerText = '(None)'
          }

          if (appDetails.download.version) {
            appDetailsModal.content.version.innerText = appDetails.download.version
          } else {
            appDetailsModal.content.version.innerText = 'Unknown'
          }

          if (appDetails.type) {
            appDetailsModal.content.type.innerText = appDetails.type
          } else {
            appDetailsModal.content.type.innerText = 'Unknown'
          }

          if (appDetails.locales) {
            if (typeof appDetails.locales === 'string') {
              appDetailsModal.content.locales.innerText = appDetails.locales
            } else if (Array.isArray(appDetails.locales)) {
              appDetailsModal.content.locales.innerText = separateArrayCommas(appDetails.locales)
            }
          } else {
            appDetailsModal.content.locales.innerText = 'Unknown'
          }

          if (typeof (appDetails.has_ads) !== 'undefined') {
            appDetailsModal.content.has_ads.innerText = i18next.t('ads') + `: ${appDetails.has_ads}`
          } else {
            appDetailsModal.content.has_ads.innerText = i18next.t('ads') + ': Unknown'
          }

          if (typeof (appDetails.has_tracking) !== 'undefined') {
            appDetailsModal.content.has_tracking.innerText = i18next.t('tracking') + `: ${appDetails.has_tracking}`
          } else {
            appDetailsModal.content.has_tracking.innerText = i18next.t('tracking') + ': Unknown'
          }

          if (appDetails.license) {
            appDetailsModal.content.license.innerText = appDetails.license
          } else {
            appDetailsModal.content.license.innerText = 'Unknown'
          }

          if (StoreDbAPI.db.apps.downloadCounts[appDetails.slug]) {
            appDetailsModal.content.downloadCount.innerText = StoreDbAPI.db.apps.downloadCounts[appDetails.slug]
          } else {
            appDetailsModal.content.downloadCount.innerText = 'Unknown'
          }

          reloadAppRatings(appDetails.slug)

          if (appDetails.download.url) {
            appDetailsModal.buttons.download.classList.remove('is-hidden')
            appDownloadsModal.buttons.download.classList.remove('is-hidden')
            appDownloadsModal.buttons.download.setAttribute('data-app-download', appDetails.download.url)
            appDownloadsModal.buttons.download.setAttribute('data-app-appid', appDetails.slug)
            appDownloadsModal.content.qrcode.innerHTML = ''
            new QRCode(appDownloadsModal.content.qrcode, 'bhackers:' + appDetails.slug)
          } else {
            appDetailsModal.buttons.download.classList.add('is-hidden')
            appDownloadsModal.buttons.download.classList.add('is-hidden')
          }

          if (appDetails.website) {
            appDetailsModal.buttons.website.classList.remove('is-hidden')
            appDetailsModal.buttons.website.setAttribute('data-app-website', appDetails.website)
          } else {
            appDetailsModal.buttons.website.classList.add('is-hidden')
          }

          if (appDetails.git_repo) {
            appDetailsModal.buttons.repo.classList.remove('is-hidden')
            appDetailsModal.buttons.repo.setAttribute('data-app-repo', appDetails.git_repo)
          } else {
            appDetailsModal.buttons.repo.classList.add('is-hidden')
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
            message: i18next.t('app-exist-error') + ' "' + appMainCategory + '"!',
            type: 'is-danger'
          })
        }
      } else {
        bulmaToast.toast({
          message: i18next.t('category-exist-error.1') + ' "' + appMainCategory + '" ' + i18next.t('category-exist-error.2'),
          type: 'is-danger'
        })
      }
    }
  }

  function addAppCard (appDetails) {
    appCardsColumnElements[appCardColumn].appendChild(document.createElement('br'))
  
    const card = document.createElement('div')
    card.id = appDetails.slug
    card.classList.add('card')
    appCardsColumnElements[appCardColumn].appendChild(card)
  
    const cardContent = document.createElement('div')
    cardContent.classList.add('card-content')
    card.appendChild(cardContent)
  
    const media = document.createElement('div')
    media.classList.add('media')
    cardContent.appendChild(media)
  
    const mediaLeft = document.createElement('div')
    mediaLeft.classList.add('media-left')
    media.appendChild(mediaLeft)
  
    const figure = document.createElement('figure')
    figure.classList.add('image', 'is-48x48', 'is-unselectable')
  
    const img = document.createElement('img')
    img.src = appDetails.icon
  
    figure.appendChild(img)
  
    mediaLeft.appendChild(figure)
  
    const mediaContent = document.createElement('div')
    mediaContent.classList.add('media-content')
    media.appendChild(mediaContent)
  
    const mediaContentTitle = document.createElement('p')
    mediaContentTitle.classList.add('title', 'is-4')
    mediaContentTitle.innerText = appDetails.name
    mediaContent.appendChild(mediaContentTitle)
  
    const mediaContentSubtitle = document.createElement('p')
    mediaContentSubtitle.classList.add('subtitle', 'is-6')
    mediaContentSubtitle.innerText = generateReadableCategories(appDetails.meta.categories)
    mediaContent.appendChild(mediaContentSubtitle)
  
    const content = document.createElement('div')
    content.classList.add('content')
    content.innerText = appDetails.description
    cardContent.appendChild(content)
  
    const cardFooter = document.createElement('footer')
    cardFooter.classList.add('card-footer')
    card.appendChild(cardFooter)
  
    const cardFooter_ViewAppDetails = document.createElement('a')
    cardFooter_ViewAppDetails.classList.add('card-footer-item', 'is-unselectable', 'app')
    cardFooter_ViewAppDetails.setAttribute('data-app-categories', appDetails.meta.categories.toString())
    cardFooter_ViewAppDetails.setAttribute('data-app-name', appDetails.name)
    cardFooter_ViewAppDetails.setAttribute('data-app-slug', appDetails.slug)
    cardFooter_ViewAppDetails.innerText = i18next.t('view-app-details')
    cardFooter.appendChild(cardFooter_ViewAppDetails)
  
    if (navigator.share) {
      const cardFooter_ShareApp = document.createElement('a')
      cardFooter_ShareApp.classList.add('card-footer-item', 'is-unselectable')
      cardFooter_ShareApp.innerText = i18next.t('share-app')
      cardFooter_ShareApp.onclick = function () {
        navigator.share({
          title: appDetails.name,
          text: appDetails.description,
          url: 'https://store.bananahackers.net/#' + appDetails.slug
        }).then(function () {
          console.log(`[Index Controller] Shared app '${appDetails.slug}' successfully.`)
        }).catch(function (err) {
          console.error(`[Index Controller] Could not share app '${appDetails.slug}': ` + err)
        })
      }
      cardFooter.appendChild(cardFooter_ShareApp)
    } else if (navigator.clipboard) {
      const cardFooter_ShareApp = document.createElement('a')
      cardFooter_ShareApp.classList.add('card-footer-item', 'is-unselectable')
      cardFooter_ShareApp.innerText = i18next.t('copy-app')
      cardFooter_ShareApp.onclick = function () {
        navigator.clipboard.writeText('https://store.bananahackers.net/#' + appDetails.slug).then(function () {
          console.log(`[Index Controller] Copied app '${appDetails.slug}' to clipboard successfully.`)
        }).catch(function (err) {
          console.error(`[Index Controller] Could not copy app '${appDetails.slug}' to clipboard: ` + err)
        })
      }
      cardFooter.appendChild(cardFooter_ShareApp)
    }

    appCardColumn++;
    if (appCardColumn > 2) {
      appCardColumn = 0
    }
  }

  document.getElementById('scrolltop-fab').onclick = function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const reloadButton = document.getElementById('reload-button')

  const sortSelect = document.getElementById('sort-select')
  sortSelect.onchange = function (e) {
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

    sortSelect.disabled = true
    reloadButton.disabled = true

    for (const appCardColumnElement of appCardsColumnElements) {
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
        const appSlug = window.location.hash.split('#')[1]
        if (typeof appSlug !== 'undefined') {
          document.querySelector(`[data-app-slug="${appSlug}"]`).click()
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
    }).catch(function (err) {
      reloadButton.classList.remove('is-loading')
      sortSelect.disabled = false
      reloadButton.disabled = false

      bulmaToast.toast({
        message: i18next.t('app-sort-success'),
        type: 'is-danger'
      })

      console.log(err)
    })
  }

  const categoriesTabsElement = document.getElementById('categories-tabs')
  categoriesTabsElement.onclick = function (e) {
    const targetElementClasses = e.target.classList
    if (targetElementClasses.contains('category-link') || targetElementClasses.contains('category-tab')) {
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

  const userDetails = {
    username: null,
    logintoken: null
  }

  const userModal = {
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
    let isLoginDetailsSaved = false

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

  let isUserLoggedIn = false

  const userButton = {
    button: document.getElementById('user-button'),
    icon: document.getElementById('user-icon')
  }

  userButton.button.onclick = function () {
    if (isUserLoggedIn) {
      userDetails.username = null
      userDetails.logintoken = null
      userButton.button.classList.remove('is-danger')
      userButton.button.classList.add('is-link')
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

  const updateModal = {
    controller: new BulmaModal('#webstore-update-modal'),
    buttons: {
      update: document.getElementById('webstore-update-modal-update-button')
    }
  }

  updateModal.buttons.update.onclick = function () {
    location.reload()
  }

  function reloadData () {
    sortSelect.disabled = true
    reloadButton.classList.add('is-loading')
    reloadButton.disabled = true

    // const githubCommitLabel = document.getElementById('webstore-github-commit-label')
    // githubCommitLabel.classList.remove('is-danger')

    categoriesTabsElement.innerHTML = ''

    for (const appCardColumnElement of appCardsColumnElements) {
      appCardColumnElement.innerHTML = ''
    }

    StoreDbAPI.loadDb().then(function (data) {
      for (const category in data.categories) {
        const newCategoryTab = {
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
          }
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

        for (const faIconClass of data.categories[category].icon.split(' ')) {
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
      document.querySelector(`.category-tab[data-category-id*="${currentSelectedCategory}"]`).classList.add('is-active')
      sortSelect.dispatchEvent(new Event('change'))

      const totalAppsLabel = document.getElementById('data-total-apps-label')
      totalAppsLabel.innerText = data.apps.raw.length
      totalAppsLabel.classList.remove('is-danger')
      totalAppsLabel.classList.add('is-success')

      // const githubCommitWorker = new Worker('assets/js/index/workers/githubcommit-worker.js')
      // githubCommitWorker.onmessage = function (e) {
      //   githubCommitWorker.terminate()
      //   if (e.data !== null) {
      //     githubCommitLabel.innerText = e.data.substring(0, 7)
      //     githubCommitLabel.setAttribute('href', 'https://github.com/jkelol111/webstore/blob/' + e.data + '/src/')
      //     githubCommitLabel.classList.remove('is-danger')
      //     githubCommitLabel.classList.add('is-success')

      //     if (!isFirstInitCompleted) {
      //       currentWebStoreVersion = e.data
      //       isFirstInitCompleted = true
      //     }

      //     if (e.data !== currentWebStoreVersion) {
      //       updateModal.controller.show()
      //     }
      //   }
      // }
      // githubCommitWorker.postMessage(null)

      bulmaToast.toast({
        message: i18next.t('data-load-success'),
        type: 'is-success'
      })
    }).catch(function (err) {
      bulmaToast.toast({
        message: i18next.t('data-load-error'),
        type: 'is-danger'
      })
      console.error(err)
    })
  }

  reloadButton.onclick = function () {
    reloadData()
  }

  reloadData()
}).catch(err => {
  console.error(err)
  bulmaToast.toast({
    message: err,
    type: "is-danger"
  })
});
