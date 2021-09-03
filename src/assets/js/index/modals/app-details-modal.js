'use strict';

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

appDetailsModal.buttons.download.onclick = () => {
  appDownloadsModal.controller.show()
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

function setAppDetailsModalDetails (appDetails) {
  if (appDetails.name) {
    appDetailsModal.content.name.innerText = appDetails.name;
  } else {
    appDetailsModal.content.name.innerText = '???';
  }

  if (appDetails.icon) {
    appDetailsModal.content.icon.src = appDetails.icon;
  } else {
    appDetailsModal.content.icon.src = 'icons/default-icon.png';
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
    appDetailsModal.buttons.download.classList.remove('is-hidden');
  } else {
    appDetailsModal.buttons.download.classList.add('is-hidden');
  }

  if (appDetails.website) {
    appDetailsModal.buttons.website.classList.remove('is-hidden')
    appDetailsModal.buttons.website.href = appDetails.website
  } else {
    appDetailsModal.buttons.website.classList.add('is-hidden')
  }

  if (appDetails.git_repo) {
    appDetailsModal.buttons.repo.classList.remove('is-hidden')
    appDetailsModal.buttons.repo.href = appDetails.git_repo
  } else {
    appDetailsModal.buttons.repo.classList.add('is-hidden')
  }

  if (appDetails.donation) {
    appDetailsModal.buttons.donation.style.display = 'initial'
    appDetailsModal.buttons.donation.href = appDetails.donation;
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

  setAppDownloadModalDetails(appDetails);
}