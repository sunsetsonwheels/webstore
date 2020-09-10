const stores = [
  "https://banana-hackers.gitlab.io/store-db/data.json",
  "https://bananahackers.github.io/data.json"
]

const stats = [
  "https://bhackers.uber.space/ssr/v1/"
]

onmessage = function () {
  var storeData = {
    categories: {},
    apps: [],
    downloads: {},
    generated_at: undefined
  }

  function resetStoreData () {
    storeData.categories = {}
    storeData.apps = []
  }

  for (var store of stores) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', store, false)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send()
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        var rawStoreData = JSON.parse(xhr.responseText)
        if (rawStoreData.categories) storeData.categories = rawStoreData.categories
        if (rawStoreData.apps) storeData.apps = rawStoreData.apps
        if (rawStoreData.generated_at) storeData.generated_at = rawStoreData.generated_at
        break
      } catch (err) {
        console.error('[Store Worker] Error parsing response from store: ' + err)
        resetStoreData()
      }
    } else {
      console.error('[Store Worker] Error making request to store: ' + xhr.status)
      resetStoreData()
    }
  }

  postMessage(storeData)
}