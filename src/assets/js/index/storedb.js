class StoreDatabaseAPI {
  constructor () {
    this.data = {}
  }

  loadData () {
    var that = this
    return new Promise(function (resolve, reject) {   
      var worker = new Worker('assets/js/index/workers/store-worker.js')
      worker.onmessage = function (e) {
        worker.terminate()
        that.data = e.data
        resolve(e.data)
      }
      worker.onerror = function (err) {
        reject(err)
      }
      worker.postMessage(null)
    })
  }

  getAppsByCategory(category) {
    if (category in this.data.categories) {
      return this.data.apps.categorical[category]
    } else {
      throw new TypeError('Category "' + category + '" does not exist!')
    }
  }

  sortApps(apps, sort) {
    return new Promise(function (resolve, reject) {
      var worker = new Worker('assets/js/index/workers/sort-worker.js')
      worker.onmessage = function (e) {
        worker.terminate()
        resolve(e.data.apps)
      }
      worker.onerror = function (err) {
        reject(err)
      }
      switch (sort) {
        case 'alphabetical':
        case 'popularity':
        case 'categorical':
          worker.postMessage({
            apps: apps,
            sort: sort
          })
          break
        default:
          console.warn("[StoreDb] Unable to sort, returning unsorted apps.")
          resolve(apps)
          break
      }
    })
  }
}