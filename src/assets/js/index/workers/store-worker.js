const stores = [
  "https://banana-hackers.gitlab.io/store-db/data.json",
  "https://bananahackers.github.io/data.json"
]

const downloadCounts = [
  "https://bhackers.uber.space/srs/v1/download_counter"
]

importScripts('wlog.js')

onmessage = function (e) {
  wLog('log', 'Store worker started.')
  var storeData = {
    categories: {
      all: {
        name: 'All apps',
        icon: 'fas fa-store'
      }
    },
    apps: {
      raw: [],
      sorted: {
        alphabetical: [],
        popularity: [],
        categorical: {}
      }
    },
    downloadCount: {},
    generatedAt: null
  }

  function resetStoreData () {
    storeData.categories = {}
    storeData.apps = []
  }

  for (const store of stores) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', store, false)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send()
    if (xhr.status >= 200 && xhr.status < 300) {
      wLog('log', 'Received successful response from "' + store + '".')
      try {
        var rawStoreData = JSON.parse(xhr.responseText)
        if (rawStoreData.generated_at) {
          wLog('log', 'Found data "generated_at".')
          storeData.generatedAt = rawStoreData.generated_at
        }
        if (rawStoreData.categories) {
          wLog('log', 'Found data "categories".')
          for (const category in rawStoreData.categories) {
            storeData.categories[category] = rawStoreData.categories[category]
          }
        }
        if (rawStoreData.apps) {
          wLog('log', 'Found data "apps".')
          storeData.apps.raw = rawStoreData.apps
          for (const app of storeData.apps.raw) {
            for (const category of app.meta.categories) {
              if (!storeData.apps.sorted.categorical[category]) {
                storeData.apps.sorted.categorical[category] = {}
              }
              if (!storeData.apps.sorted.categorical[category][app.name]) {
                storeData.apps.sorted.categorical[category][app.name] = app
              }
            }
          }
          if (!storeData.apps.sorted.categorical['all']) {
            storeData.apps.sorted.categorical['all'] = {}
          }
          for (const category in storeData.categories) {
            for (const app in storeData.apps.sorted.categorical[category]) {
              if (!storeData.apps.sorted.categorical['all'][app]) {
                storeData.apps.sorted.categorical['all'][app] = storeData.apps.sorted.categorical[category][app]
              }
            }
          }
        }
        break
      } catch (err) {
        wLog('error', 'Error parsing response from store: ' + err)
        resetStoreData()
      }
    } else {
      wLog('error', 'Error making request to store: ' + xhr.status)
      resetStoreData()
    }
  }

  postMessage(storeData)
}