'use strict'

const toastAnimateOptions = { in: "bounceInDown", out: "bounceOutUp" }

document.getElementById('scrolltop-fab').onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// var storeWorker = new Worker('assets/js/index/workers/store-worker.js')
// storeWorker.onmessage = function (e) {
//   storeWorker.terminate()

//   var dataGeneratedLabel = document.getElementById('data-generated-time-label')
//   if (e.data.generated_at) {
//     dataGeneratedLabel.innerText = (new Date(e.data.generated_at))
//     dataGeneratedLabel.classList.remove('is-danger')
//     dataGeneratedLabel.classList.add('is-success')
//   }

//   for (const category in e.data.categories) {
//     allCategories[category] = e.data.categories[category]
//   }
//   console.log(allCategories)

//   allAppsRaw = e.data.apps

//   for (var app of allAppsRaw) {
//     for (var category of app.meta.categories) {
//       if (!allAppsSorted[category]) allAppsSorted[category] = {}
//       if (!allAppsSorted[category][app.name]) {
//         allAppsSorted[category][app.name] = app
//       }
//     }
//   }

//   loadCategoriesTabs()

//   console.log(allAppsSorted)

//   var pageLoadedLabel = document.getElementById('page-loaded-time-label')
//   pageLoadedLabel.innerText = (new Date().toString())
//   pageLoadedLabel.classList.remove('is-danger')
//   pageLoadedLabel.classList.add('is-success')

//   bulmaToast.toast({
//     message: 'Data loaded successfully!',
//     type: "is-success",
//     position: "top-center",
//     closeOnClick: true,
//     pauseOnHover: true,
//     animate: toastAnimateOptions
//   })
// }
// storeWorker.postMessage(null)

var StoreDbAPI = new StoreDatabaseAPI()

var categoriesTabsElement = document.getElementById('categories-tabs')
var appsListElement = document.getElementById('apps-list')

var reloadButton = document.getElementById('reload-button')

function listAppsByCategory (category, sort) {
  if (sort in StoreDbAPI.data.apps.sorted && category in StoreDbAPI.data.categories) {
    return StoreDbAPI.sortApps(StoreDbAPI.getAppsByCategory(category), sort)
  } else {
    throw new TypeError('Invalid sort/category! (category: ' + category + ', sort: ' + sort + ')')
  }
}

function reloadData () {
  document.getElementById('sort-select').disabled = true
  reloadButton.disabled = true

  StoreDbAPI.loadData().then(function (data) {
    categoriesTabsElement.innerHTML = ''
    appsListElement.innerHTML = ''
  
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

    listAppsByCategory('all', 'alphabetical').then(function (d) {
      console.log(d)
    })
    listAppsByCategory('all', 'popularity').then(function (d) {
      console.log(d)
    })

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

    document.getElementById('sort-select').disabled = false
    reloadButton.disabled = false

    bulmaToast.toast({
      message: 'Data loaded successfully!',
      type: "is-success",
      position: "top-center",
      closeOnClick: true,
      pauseOnHover: true,
      animate: toastAnimateOptions
    })
    console.log(data)
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
