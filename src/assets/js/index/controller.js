'use strict'

// Global variables.
var currentSelectedCategory = 'all';
var appCardColumn = 0;

// Global elements.
const reloadButton = document.getElementById('reload-button');
const sortSelect = document.getElementById('sort-select');
const categoriesTabsElement = document.getElementById('categories-tabs');
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
const appCardsColumnElements = [
  document.getElementById('app-cards-column-0'),
  document.getElementById('app-cards-column-1'),
  document.getElementById('app-cards-column-2')
]

function addAppCard (appDetails) {
  const newCardHTML = `
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
        <a class="card-footer-item is-unselectable app-details"
           data-app-name="${appDetails.name}"
           data-app-slug="${appDetails.slug}">
          ${i18next.t("info")}
        </a>
        <a class="card-footer-item is-unselectable app-download"
           data-app-name="${appDetails.name}"
           data-app-slug="${appDetails.slug}">
           ${i18next.t("download")}
        </a>
        <a class="card-footer-item is-unselectable app-share"
           data-app-name="${appDetails.name}"
           data-app-slug="${appDetails.slug}">
          ${i18next.t("share")}
        </a>
      </footer>
    </div>
  `;
  appCardsColumnElements[appCardColumn].innerHTML += newCardHTML;

  appCardColumn++;
  if (appCardColumn > appCardsColumnElements.length - 1) {
    appCardColumn = 0
  }
}

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

  sortSelect.disabled = true
  reloadButton.disabled = true

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

categoriesTabsElement.onclick = (e) => {
  const targetElementClasses = e.target.classList
  if (targetElementClasses.contains('category-tab')) {
    currentSelectedCategory = e.target.getAttribute('data-category-id');
    for (const categoryTabElement of document.querySelectorAll('.category-tab')) {
      if (categoryTabElement.getAttribute('data-category-id') === currentSelectedCategory) {
        categoryTabElement.classList.add('is-active');
      } else {
        categoryTabElement.classList.remove('is-active');
      }
    }
    sortSelect.dispatchEvent(new Event('change'));
  }
}

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

async function reloadAppRatings (appID) {
  appDetailsModal.content.ratings.loggedIn.details.innerHTML = '<strong>@Unknown</strong>';
  appDetailsModal.content.ratings.loggedIn.points.value = 1;
  appDetailsModal.content.ratings.loggedIn.description.value = '';
  appDetailsModal.content.ratings.loggedIn.points.disabled = true;
  appDetailsModal.content.ratings.loggedIn.description.disabled = true;
  appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add('is-hidden');
  appDetailsModal.content.ratings.loggedIn.submitButton.classList.add('is-loading');
  appDetailsModal.content.ratings.loggedIn.submitButton.disabled = true;
  appDetailsModal.content.ratings.averageRating.innerText = 'Unknown ★';
  appDetailsModal.content.ratings.allRatings.innerHTML = i18next.t('load-ratings');

  try {
    const ratings = await StoreDbAPI.getAppRatings(appID);
    appDetailsModal.content.ratings.allRatings.innerHTML = ''

    var isPersonalReviewExists = false

    if (ratings.average) {
      appDetailsModal.content.ratings.averageRating.innerText = `${ratings.average.toFixed(1)} ★`
    }
    for (const rating of ratings.ratings) {
      const ratingCreationTime = relTime.getRelativeTime(new Date(rating.creationtime * 1000))
      if (rating.username === userCredentials.username) {
        appDetailsModal.content.ratings.loggedIn.details.innerHTML = `<strong>@${rating.username}</strong> (you) • <small>${ratingCreationTime}</small>`
        appDetailsModal.content.ratings.loggedIn.points.disabled = false
        appDetailsModal.content.ratings.loggedIn.description.disabled = false
        appDetailsModal.content.ratings.loggedIn.points.value = rating.points
        appDetailsModal.content.ratings.loggedIn.description.value = rating.description
        appDetailsModal.content.ratings.loggedIn.points.disabled = true
        appDetailsModal.content.ratings.loggedIn.description.disabled = true
        isPersonalReviewExists = true
      } else {
        appDetailsModal.content.ratings.allRatings.innerHTML += `
          <div class="box">
            <article class="media">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>@${rating.username}</strong> • <small>${rating.points} ★</small> • <small>${ratingCreationTime}</small>
                  </p>
                  <p>${rating.description}></p>
                </div>
              </div>
            </acticle>
          </div>
        `;
      }
    }

    appDetailsModal.content.ratings.loggedIn.submitButton.setAttribute('data-app-appid', appID)
    if (isPersonalReviewExists) {
      appDetailsModal.content.ratings.loggedIn.points.disabled = true
      appDetailsModal.content.ratings.loggedIn.description.disabled = true
      appDetailsModal.content.ratings.loggedIn.submitButton.disabled = true
    } else {
      appDetailsModal.content.ratings.loggedIn.details.innerHTML = `<strong>@${userCredentials.username}</strong> (you)`
      appDetailsModal.content.ratings.loggedIn.points.disabled = false
      appDetailsModal.content.ratings.loggedIn.description.disabled = false
      appDetailsModal.content.ratings.loggedIn.submitButton.disabled = false
    }
    appDetailsModal.content.ratings.loggedIn.submitButton.classList.remove('is-loading')
  } catch (err) {
    bulmaToast.toast({
      message: err,
      type: 'is-danger'
    });
    console.error(err);
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

appDetailsModal.content.ratings.loggedIn.submitButton.onclick = async () => {
  appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add('is-hidden')
  if (appDetailsModal.content.ratings.loggedIn.description.value.length > 2 && isUserLoggedIn) {
    appDetailsModal.content.ratings.loggedIn.submitButton.classList.add('is-loading')
    appDetailsModal.content.ratings.loggedIn.submitButton.disabled = true
    appDetailsModal.content.ratings.loggedIn.points.disabled = true
    appDetailsModal.content.ratings.loggedIn.description.disabled = true
    StoreDbAPI.addNewRating(
      userCredentials.username,
      userCredentials.logintoken,
      appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute('data-app-appid'),
      appDetailsModal.content.ratings.loggedIn.points.value,
      appDetailsModal.content.ratings.loggedIn.description.value
    ).then(function () {
      setTimeout(async () => {
        await reloadAppRatings(appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute('data-app-appid'))
      }, 2000)
    }).catch(function () {
      setTimeout(async () => {
        await reloadAppRatings(appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute('data-app-appid'))
      }, 2000)
    })
  } else {
    appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.remove('is-hidden')
  }
}

appDownloadsModal.buttons.download.onclick = (e) => {
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

const appCardsContainerElement = document.getElementById('app-cards-container')
appCardsContainerElement.onclick = async (e) => {
  const targetElementClasses = e.target.classList
  if (targetElementClasses.contains('app-details')) {
    const appDetails = StoreDbAPI.db.apps.objects[e.target.getAttribute('data-app-name')]
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

      reloadAppRatings(appDetails.slug);

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
  } else if (targetElementClasses.contains("app-share")) {
    const shareURL = `https://store.bananahackers.net/#${e.target.getAttribute("data-app-slug")}`
    if (navigator.share) {
      try {
        await navigator.share({
          url: shareURL
        });
      } catch (err) {
        console.error(`[Index Controller] Could not share app '${e.target.getAttribute("data-app-slug")}': ${err}`)
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareURL)
        bulmaToast.toast({
          message: i18next.t('copy-to-clipboard-success'),
          type: 'is-success'
        })
      } catch (err) {
        console.error(`[Index Controller] Could not copy app '${appDetails.slug}' to clipboard: ${err}`)
      }
    }
  }
}

reloadButton.onclick = async () => {
  await reloadData()
}