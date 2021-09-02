'use strict'

onmessage = (e) => {
  const copyApps = Object.entries(e.data.apps);
  switch (e.data.sort) {
    case 'alphabetical':
      copyApps.sort((a, b) => {
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
        copyApps.sort((a, b) => {
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
        console.warn("Not sorting!")
      }
      break
    case 'categorical':
      copyApps.sort((a, b) => {
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
    case 'ratings':
      break
    default:
      break
  }
  const finalSorted = {}
  for (const app of copyApps) {
    finalSorted[app[0]] = app[1]
  }
  postMessage(finalSorted);
}