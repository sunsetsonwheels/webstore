importScripts('wlog.js')

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
  wLog('log', 'Sorting using "' + e.data.sort + '" sort.')
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
      if (e.data.downloadCounts) {
        copyApps.sort(function (a, b) {
          const A = e.data.downloadCounts[a[1].slug]
          const B = e.data.downloadCounts[b[1].slug]
          if (A > B) {
            return -1 
          } else if (A < B) {
            return 1
          } else {
            return 0
          }
        })
      } else {
        wLog('error', 'Missing downloadCounts to sort by popularity!')
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