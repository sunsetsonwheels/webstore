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

function addAppCard (appInfo) {
  console.log(appInfo)
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
  var readableCategories = ''
  const categoriesLength = appInfo.meta.categories.length
  for (const categoryIndex in appInfo.meta.categories) {
    const categoryRawName = appInfo.meta.categories[categoryIndex]
    const categoryFriendlyName = StoreDbAPI.data.categories[categoryRawName].name
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

    listAppsByCategory('all', 'alphabetical').then(function (allApps) {
      for (const app in allApps) {
        addAppCard(allApps[app])
      }
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

    listAppsByCategory('all', 'popularity').then(function (d) {
      console.log(d)
    })
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
