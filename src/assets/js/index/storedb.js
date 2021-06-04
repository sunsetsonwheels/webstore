class StoreDatabaseAPI {
  constructor () {
    this.db = {}
  }

  loadData () {
    const that = this
    return new Promise(function (resolve, reject) {
      const worker = new Worker('assets/js/index/workers/store-worker.js')
      worker.onmessage = function (e) {
        worker.terminate()
        that.db = e.data
        resolve(e.data)
      }
      worker.onerror = function (err) {
        worker.terminate()
        reject(err)
      }
      worker.postMessage(null)
    })
  }

  getAppsByCategory (category) {
    if (category in this.db.categories) {
      return this.db.apps.categorical[category]
    } else {
      throw new TypeError('Category "' + category + '" does not exist!')
    }
  }

  sortApps (apps, sort) {
    const that = this
    return new Promise(function (resolve, reject) {
      const worker = new Worker('assets/js/index/workers/sort-worker.js')
      worker.onmessage = function (e) {
        worker.terminate()
        resolve(e.data.apps)
      }
      worker.onerror = function (err) {
        worker.terminate()
        reject(err)
      }
      switch (sort) {
        case 'alphabetical':
        case 'categorical':
          worker.postMessage({
            apps: apps,
            sort: sort
          })
          break
        case 'popularity':
          worker.postMessage({
            apps: apps,
            sort: sort,
            downloadCounts: that.db.apps.downloadCounts
          })
          break
        default:
          console.warn('[StoreDb] Unable to sort, returning unsorted apps.')
          resolve(apps)
          break
      }
    })
  }

  dlCountApp (appSlug) {
    return new Promise(function (resolve, reject) {
      const worker = new Worker('assets/js/index/workers/ratings-worker.js')
      worker.onmessage = function (e) {
        worker.terminate()
        if (e.data.success) {
          resolve(e.data)
        } else {
          reject(e.data)
        }
      }
      worker.onerror = function (err) {
        worker.terminate()
        reject({
          success: false,
          response: {
            error: err
          }
        })
      }
      worker.postMessage({
        command: 'count',
        args: {
          slug: appSlug
        }
      })
    })
  }

  getAppRatings (appID) {
    return new Promise(function (resolve, reject) {
      const worker = new Worker('assets/js/index/workers/ratings-worker.js')
      worker.onmessage = function (e) {
        worker.terminate()
        if (e.data.success) {
          resolve(e.data)
        } else {
          reject(e.data)
        }
      }
      worker.onerror = function (err) {
        worker.terminate()
        reject({
          success: false,
          response: {
            error: err
          }
        })
      }
      worker.postMessage({
        command: 'get',
        args: {
          appid: appID
        }
      })
    })
  }

  loginToRatingsAccount (ausername, alogintoken) {
    return new Promise(function (resolve, reject) {
      const worker = new Worker('assets/js/index/workers/ratings-worker.js')
      worker.onmessage = function (e) {
        worker.terminate()
        if (e.data.success) {
          resolve(e.data)
        } else {
          reject(e.data)
        }
      }
      worker.onerror = function (err) {
        worker.terminate()
        reject({
          success: false,
          response: {
            error: err
          }
        })
      }
      worker.postMessage({
        command: 'login',
        args: {
          username: ausername,
          logintoken: alogintoken
        }
      })
    })
  }

  createRatingsAccount (ausername, alogintoken) {
    return new Promise(function (resolve, reject) {
      const worker = new Worker('assets/js/index/workers/ratings-worker.js')
      worker.onmessage = function (e) {
        worker.terminate()
        if (e.data.success) {
          resolve(e.data)
        } else {
          reject(e.data)
        }
      }
      worker.onerror = function (err) {
        worker.terminate()
        reject({
          success: false,
          response: {
            error: err
          }
        })
      }
      worker.postMessage({
        command: 'create',
        args: {
          username: ausername,
          logintoken: alogintoken
        }
      })
    })
  }

  addNewRating (ausername, alogintoken, rappid, rpoints, rdescription) {
    return new Promise(function (resolve, reject) {
      const worker = new Worker('assets/js/index/workers/ratings-worker.js')
      worker.onmessage = function (e) {
        worker.terminate()
        if (e.data.success) {
          resolve(e.data)
        } else {
          reject(e.data)
        }
      }
      worker.onerror = function (err) {
        worker.terminate()
        reject({
          success: false,
          response: {
            error: err
          }
        })
      }
      worker.postMessage({
        command: 'add',
        args: {
          username: ausername,
          logintoken: alogintoken,
          appid: rappid,
          points: rpoints,
          description: rdescription
        }
      })
    })
  }
}
