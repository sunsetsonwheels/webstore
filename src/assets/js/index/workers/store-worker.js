importScripts('wlog.js')

const stores = [
  "https://banana-hackers.gitlab.io/store-db/data.json",
  "https://bananahackers.github.io/data.json"
]

const downloadCounts = [
  "https://bhackers.uber.space/srs/v1/download_counter"
]

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
      categorical: {}
    },
    downloadCount: {},
    generatedAt: null
  }

  function resetStoreData () {
    storeData.categories = {}
    storeData.apps.raw = []
    storeData.apps.categorical = {}
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
              if (!storeData.apps.categorical[category]) {
                storeData.apps.categorical[category] = {}
              }
              if (!storeData.apps.categorical[category][app.name]) {
                storeData.apps.categorical[category][app.name] = app
              }
            }
          }
          if (!storeData.apps.categorical['all']) {
            storeData.apps.categorical['all'] = {}
          }
          for (const category in storeData.categories) {
            for (const app in storeData.apps.categorical[category]) {
              if (!storeData.apps.categorical['all'][app]) {
                storeData.apps.categorical['all'][app] = storeData.apps.categorical[category][app]
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

  wLog('log', 'Store worker completed!')
  postMessage(storeData)
}