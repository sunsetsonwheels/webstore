'use strict'

const toastAnimateOptions = { in: "bounceInDown", out: "bounceOutUp" }

document.getElementById('scrolltop-fab').onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

var storeWorker = new Worker('js/index/storedb/workers/store-worker.js')
storeWorker.onmessage = function (e) {
  storeWorker.terminate()

  var dataGeneratedLabel = document.getElementById('data-generated-time-label')
  if (e.data.generated_at) {
    dataGeneratedLabel.innerText = (new Date(e.data.generated_at))
    dataGeneratedLabel.classList.remove('is-danger')
    dataGeneratedLabel.classList.add('is-success')
  }

  for (const category in e.data.categories) {
    allCategories[category] = e.data.categories[category]
  }
  console.log(allCategories)

  allAppsRaw = e.data.apps

  for (var app of allAppsRaw) {
    for (var category of app.meta.categories) {
      if (!allAppsSorted[category]) allAppsSorted[category] = {}
      if (!allAppsSorted[category][app.name]) {
        allAppsSorted[category][app.name] = app
      }
    }
  }

  loadCategoriesTabs()

  console.log(allAppsSorted)

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
}
storeWorker.postMessage(null)

var githubCommitWorker = new Worker('js/index/workers/githubcommit-worker.js')
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
