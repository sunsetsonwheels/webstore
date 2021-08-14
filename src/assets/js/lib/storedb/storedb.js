class StoreDatabaseAPI {
  constructor () {
    this.stores = [
      "https://banana-hackers.gitlab.io/store-db/data.json",
      "https://bananahackers.github.io/store-db/data.json",
      "https://bananahackers.github.io/data.json"
    ];
    this.ratingServers = [
      "https://bhackers.uber.space/srs/v1"
    ];
    this.currentStore = {
      index: 0,
      url: this.stores[0]
    };
    this.currentRatingServer = {
      index: 0,
      url: this.ratingServers[0]
    };
    this.db = {
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
    };
  }

  #resetDb () {
    storeData.categories = {
      all: {
        name: 'All apps',
        icon: 'fas fa-store'
      }
    };
    storeData.apps.raw = [];
    storeData.apps.categorical = {};
    storeData.apps.downloadCounts = {};
  }

  async loadDb () {
    for (const storeURL of this.stores) {
      const rawDb = await fetch(storeURL);
      if (!rawDb.ok) continue;

      this.currentStore.index = this.stores.indexOf(storeURL);
      this.currentStore.url = storeURL;
      const parsedDb = await rawDb.json();

      if (parsedDb.version !== 2) continue;

      this.db.generatedAt = parsedDb.generated_at;
      this.db.categories.all = {
        name: 'All apps',
        icon: 'fas fa-store'
      };
      this.db.categories = Object.assign(this.db.categories, parsedDb.categories);

      this.db.apps.raw = parsedDb.apps;
      for (const app of this.db.apps.raw) {
        for (const category of app.meta.categories) {
          if (!this.db.apps.categorical[category]) {
            this.db.apps.categorical[category] = {};
          }
          if (!this.db.apps.categorical[category][app.name]) {
            this.db.apps.categorical[category][app.name] = app;
          }
        }
      }
      
      this.db.apps.categorical.all = {}
      for (const category in this.db.categories) {
        for (const app in this.db.apps.categorical[category]) {
          if (!this.db.apps.categorical.all[app]) {
            this.db.apps.categorical.all[app] = this.db.apps.categorical[category][app];
          }
        }
      }
      break;
    }

    for (const ratingServerURL of this.ratingServers) {
      const rawDownloadCounts = await fetch(`${ratingServerURL}/download_counter`);
      if (!rawDownloadCounts.ok) continue;
      this.currentRatingServer.index = this.ratingServers.indexOf(ratingServerURL);
      this.currentRatingServer.url = ratingServerURL;
      this.db.apps.downloadCounts = await rawDownloadCounts.json();
      break;
    }

    console.log(this.db)
    return this.db
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
      const worker = new Worker('assets/js/lib/storedb/workers/sort-worker.js')
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

  async dlCountApp (appSlug) {
    await fetch(`${this.currentStore.url}/count/${appSlug}`)
  }

  async getAppRatings (appID) {
    const rawRatings = await fetch(`${this.currentRatingServer.url}/ratings/${appID}`)
    return await rawRatings.json()
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
