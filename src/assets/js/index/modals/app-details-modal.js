'use strict';

const appDetailsModal = {
  controller: new BulmaModal('#app-details-modal'),
  content: {
    container: document.getElementById("app-details-modal-details-container"),
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
    size: document.getElementById('app-details-modal-app-size'),
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
  appDetailsModal.content.ratings.loggedIn.details.innerHTML = '<strong>@?</strong>';
  appDetailsModal.content.ratings.loggedIn.points.value = 1;
  appDetailsModal.content.ratings.loggedIn.description.value = '';
  appDetailsModal.content.ratings.loggedIn.points.disabled = true;
  appDetailsModal.content.ratings.loggedIn.description.disabled = true;
  appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add('is-hidden');
  appDetailsModal.content.ratings.loggedIn.submitButton.classList.add('is-loading');
  appDetailsModal.content.ratings.loggedIn.submitButton.disabled = true;
  appDetailsModal.content.ratings.averageRating.innerText = '? ★';
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
        appDetailsModal.content.ratings.loggedIn.details.innerHTML = `<strong>@${rating.username}</strong> (${i18next.t("you")}) • <small>${ratingCreationTime}</small>`
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
      appDetailsModal.content.ratings.loggedIn.details.innerHTML = `<strong>@${userCredentials.username}</strong> (${i18next.t("you")})`
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
  appDetailsModal.content.name.innerText = appDetails.name;

  if (appDetails.icon) {
    appDetailsModal.content.icon.src = appDetails.icon;
  } else {
    appDetailsModal.content.icon.src = 'icons/default-icon.png';
  }

  if (Array.isArray(appDetails.screenshots) && appDetails.screenshots.length > 0) {
    appDetailsModal.content.screenshots.container.classList.remove("is-hidden");;
    appDetailsModal.content.screenshots.scroller.innerHTML = '';
    appDetailsModal.content.descriptionSeparator.classList.remove('is-hidden');
    appDetails.screenshots.forEach((screenshot) => {
      appDetailsModal.content.screenshots.scroller.innerHTML += `
        <img src="${screenshot}" style="padding: 4px">
      `
    });
  } else {
    appDetailsModal.content.screenshots.container.classList.add("is-hidden");
    appDetailsModal.content.descriptionSeparator.classList.add('is-hidden');
  }

  appDetailsModal.content.description.innerText = appDetails.description;

  appDetailsModal.content.categories.innerText = generateReadableCategories(appDetails.meta.categories)

  if (typeof appDetails.author === 'string') {
    appDetailsModal.content.authors.innerText = appDetails.author
  } else if (Array.isArray(appDetails.author)) {
    appDetailsModal.content.authors.innerText = separateArrayCommas(appDetails.author)
  } else {
    appDetailsModal.content.authors.innerText = "?"
  }

  if (typeof appDetails.maintainer === 'string') {
    appDetailsModal.content.maintainers.innerText = appDetails.maintainer
  } else if (Array.isArray(appDetails.maintainer)) {
    appDetailsModal.content.maintainers.innerText = separateArrayCommas(appDetails.maintainer)
  } else {
    appDetailsModal.content.maintainers.innerText = '?'
  }

  if (appDetails.dependencies) {
    appDetailsModal.content.dependencies.innerHTML = ""
    appDetails.dependencies.forEach((dependency) => {
      if (dependency.hasOwnProperty("url")) {
        appDetailsModal.content.dependencies.innerHTML = `
          <a href=${dependency.url} target="_blank">
            ${dependency.name}
          </a>&nbsp;
        `
      } else {
        appDetailsModal.content.dependencies.innerHTML += `${dependency.name}&nbsp;`;
      }
    });
  } else {
    appDetailsModal.content.dependencies.innerText = '?'
  }

  if (appDetails.download.version) {
    appDetailsModal.content.version.innerText = appDetails.download.version
  } else if (appDetails.download.manifest) {
    appDetailsModal.content.version.innerText = "..."
    fetch(`https://cors.bridged.cc/${appDetails.download.manifest}`).then(async response => {
      if (response.ok) {
        const manifest = await response.json();
        if (manifest.version) {
          appDetailsModal.content.version.innerText = manifest.version;
        } else {
          appDetailsModal.content.version.innerText = "?";
        }
      } else {
        appDetailsModal.content.version.innerText = "?";
      }
    }).catch(() => appDetailsModal.content.version.innerText = "?");
  } else {
    appDetailsModal.content.version.innerText = '?'
  }

  appDetailsModal.content.type.innerText = appDetails.type;

  if (appDetails.locales) {
    appDetailsModal.content.locales.innerText = separateArrayCommas(appDetails.locales);
  } else {
    appDetailsModal.content.locales.innerText = '?';
  }

  appDetailsModal.content.has_ads.innerText = `${i18next.t('ads')}: ${appDetails.has_ads}`;

  appDetailsModal.content.has_tracking.innerText = `${i18next.t('tracking')}: ${appDetails.has_tracking}`

  if (appDetails.license) {
    appDetailsModal.content.license.innerText = appDetails.license
  } else {
    appDetailsModal.content.license.innerText = '?'
  }

  if (StoreDbAPI.db.apps.downloadCounts[appDetails.slug]) {
    appDetailsModal.content.downloadCount.innerText = StoreDbAPI.db.apps.downloadCounts[appDetails.slug]
  } else {
    appDetailsModal.content.downloadCount.innerText = '?'
  }

  reloadAppRatings(appDetails.slug);

  if (appDetails.download.url) {
    appDetailsModal.buttons.download.classList.remove('is-hidden');
    appDetailsModal.content.size.innerText = "...";
    fetch(`https://cors.bridged.cc/${appDetails.download.url}`, {
      method: "HEAD"
    }).then(response => {
      if (response.ok) {
        appDetailsModal.content.size.innerText = `${(response.headers.get("content-length") / 1024).toFixed(2)} KB`
      } else {
        appDetailsModal.content.size.innerText = "?";
      }
    }).catch(() => appDetailsModal.content.size.innerText = "?");
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

  appDetailsModal.content.container.scrollTo({
    top: 0
  });
}