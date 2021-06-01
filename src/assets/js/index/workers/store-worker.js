'use strict'

const WORKER_NAME = "Store"

importScripts('common.js')

const stores = [
  "https://openkaios.top/openkaios-store-db/data.json"
]

const downloadCounters = [
  "https://bhackers.uber.space/srs/v1/download_counter/"
]

onmessage = function () {
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
      categorical: {},
      downloadCounts: {}
    },
    generatedAt: null
  }

  function resetStoreData () {
    storeData.categories = {}
    storeData.apps.raw = []
    storeData.apps.categorical = {}
    storeData.apps.downloadCounts = {}
  }

  for (const store of stores) {
    wLog('log', 'Making request to store: ' + store)
    const request = syncJSONRequest({
      type: 'GET',
      url: store,
      timeout: 10000,
      headers: fixedHeaders,
    })
    if (request.success) {
      wLog('log', 'Received successful response from "' + store + '".')
      try {
        var rawStoreData = request.data
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
      wLog('error', 'Error making request to store: ' + request.error)
      resetStoreData()
    }
  }

  if (storeData.apps.raw !== []) {
    for (const downloadCounter of downloadCounters) {
      wLog('log', 'Making request to download counter: ' + downloadCounter)
      const request = syncJSONRequest({
        type: 'GET',
        url: downloadCounter,
        timeout: 10000,
        headers: fixedHeaders
      })
      if (request.success) {
        try {
          wLog('log', 'Received successful response from: ' + downloadCounter)
          storeData.apps.downloadCounts = request.data
        } catch (err) {
          wLog('error', 'Error parsing response from download counter: ' + err)
        }
      } else {
        wLog('error', 'Error making request to download counter: ' + request.error)
      }
    } 
  }

  wLog('log', 'Store worker completed!')
  postMessage(storeData)
}