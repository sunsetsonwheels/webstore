importScripts('wlog.js')

const downloadStats = [
  "https://bhackers.uber.space/srs/v1/download_counter"
]

onmessage = function (e) {
  wLog('log', 'Sort worker started.')
  var sortData = {
    apps: [],
    sort: null
  }
  if (typeof e.data.apps !== 'object' || typeof e.data.sort !== 'string') {
    wLog('error', 'Missing arguments for sort worker. Sending back empty data.')
    postMessage(sortData)
  }
  var copyApps = Object.entries(e.data.apps)
  switch (e.data.sort) {
    case 'alphabetical':
      copyApps.sort(function (a, b) {
        const A = a[1].name.toUpperCase()
        const B = b[1].name.toUpperCase()
        if (A > B) {
          return 1
        } else if (A < B) {
          return -1
        } else {
          return 0
        }
      })
      break
    case 'popularity':
      for (const downloadStat of downloadStats) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', downloadStat, false)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send()
        if (xhr.status >= 200 && xhr.status < 300) {
          wLog('log', 'Received successful response from "' + downloadStat + '".')
          try {
            wLog('log', 'Retrieved downloadCount list.')
            const downloadCount = JSON.parse(xhr.responseText)
            copyApps.sort(function (a, b) {
              const A = downloadCount[a[1].slug]
              const B = downloadCount[b[1].slug]
              if (A > B) {
                return 1 
              } else if (A < B) {
                return -1
              } else {
                return 0
              }
            })
            break
          } catch (err) {
            wLog('error', 'Error parsing response from download count server: ' + err)
          }
        } else {
          wLog('error', 'Error making request to download count server: ' + xhr.status)
        }
      }
      break
    case 'categorical':
      copyApps.sort(function (a, b) {
        const A = a[1].meta.categories[0].toUpperCase()
        const B = b[1].meta.categories[0].toUpperCase()
        if (A > B) {
          return 1
        } else if (A < B) {
          return -1
        } else {
          return 0
        }
      })
      break
    default:
      break
  }
  var finalSorted = {}
  for (const app of copyApps) {
    finalSorted[app[0]] = app[1]
  }
  sortData.apps = finalSorted
  wLog('log', 'Sort worker completed!')
  postMessage(sortData)
}