'use strict'

const toastAnimateOptions = { in: "bounceInRight", out: "bounceOutRight" }

document.getElementById('scrolltop-button').onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

var storeWorker = new Worker('js/index/workers/store-worker.js')
storeWorker.onmessage = function (e) {
  storeWorker.terminate()

  var dataGeneratedLabel = document.getElementById('data-generated-time-label')
  if (e.data.generated_at) {
    dataGeneratedLabel.innerText = (new Date(e.data.generated_at))
    dataGeneratedLabel.classList.remove('is-danger')
    dataGeneratedLabel.classList.add('is-success')
  }

  allCategories = e.data.categories
  console.log(allCategories)
  for (var category in allCategories) {
    selectedCategories.push(category)
    categoriesListElement.innerHTML += '<div class="control" data-category-id="' + category + '"><div class="tags has-addons"><span class="tag is-success is-unselectable is-rounded"><i class="'+ allCategories[category].icon +'"></i>' + allCategories[category].name + '</span><a class="tag is-rounded is-delete delete-category" data-category-id="' + category + '"></a></div></div>'
  }

  for (var app of e.data.apps) {
    for (var category of app.meta.categories) {
      if (!allApps[category]) allApps[category] = {}
      if (!allApps[category][app.name]) {
        allApps[category][app.name] = app
      }
    }
  }

  loadAppsFromCategories()

  console.log(allApps)

  var pageLoadedLabel = document.getElementById('page-loaded-time-label')
  pageLoadedLabel.innerText = (new Date().toString())
  pageLoadedLabel.classList.remove('is-danger')
  pageLoadedLabel.classList.add('is-success')

  bulmaToast.toast({
    message: 'Data loaded successfully!',
    type: "is-success",
    position: "top-right",
    closeOnClick: true,
    pauseOnHover: true,
    animate: toastAnimateOptions
  })
}
storeWorker.postMessage(null)

var githubCommitWorker = new Worker('js/index/workers/githubcommit-worker.js')
githubCommitWorker.onmessage = function (e) {
  if (e.data !== null) {
    var githubCommitLabel = document.getElementById('webstore-github-commit-label')
    githubCommitLabel.innerText = e.data
    githubCommitLabel.classList.remove('is-danger')
    githubCommitLabel.classList.add('is-success')
  }
}
githubCommitWorker.postMessage(null)
