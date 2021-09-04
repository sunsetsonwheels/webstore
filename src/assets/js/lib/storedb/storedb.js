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
          name: i18next.t("all-apps"),
          icon: 'fas fa-store'
        }
      },
      apps: {
        objects: {},
        downloadCounts: {},
        ratings: {}
      },
      generatedAt: null
    };
  }

  async loadDb () {
    for (const storeURL of this.stores) {
      const rawDb = await fetch(storeURL);
      if (!rawDb.ok) continue;

      this.currentStore.index = this.stores.indexOf(storeURL);
      this.currentStore.url = storeURL;
      const parsedDb = await rawDb.json();

      if (![2, 3].includes(parsedDb.version)) continue;

      this.db.generatedAt = parsedDb.generated_at;

      this.db.categories.all = {
        name: i18next.t("all-apps"),
        icon: 'fas fa-store'
      };
      Object.assign(this.db.categories, parsedDb.categories);

      for (const app of parsedDb.apps) {
        this.db.apps.objects[app.name] = app;
      }

      break;
    }

    for (const ratingServerURL of this.ratingServers) {
      const rawDownloadCounts = await fetch(`${ratingServerURL}/download_counter`);
      if (!rawDownloadCounts.ok) continue;
      this.currentRatingServer.index = this.ratingServers.indexOf(ratingServerURL);
      this.currentRatingServer.url = ratingServerURL;
      this.db.apps.downloadCounts = await rawDownloadCounts.json();
  
      const rawRatings = await fetch(`${ratingServerURL}/ratings`);
      if (!rawRatings.ok) continue;
      this.db.apps.ratings = await rawRatings.json();
      break;
    }
  }

  getAppsByCategory (category) {
    const that = this;
    return new Promise((resolve, reject) => {
      if (!this.db.categories.hasOwnProperty(category)) {
        reject(new Error('Category "' + category + '" does not exist!'));
      }

      if (category == "all") resolve(this.db.apps.objects);

      const worker = new Worker("assets/js/lib/storedb/workers/category-worker.js");
      worker.onmessage = (e) => {
        worker.terminate();
        resolve(e.data);
      }
      worker.onerror = (err) => {
        worker.terminate();
        reject(err);
      }
      worker.postMessage({
        apps: that.db.apps.objects,
        category: category
      });
    });
  }

  sortApps (apps, sort) {
    const that = this;
    return new Promise((resolve, reject) => {
      const worker = new Worker('assets/js/lib/storedb/workers/sort-worker.js')
      worker.onmessage = function (e) {
        worker.terminate();
        resolve(e.data);
      }
      worker.onerror = function (err) {
        worker.terminate();
        reject(err);
      }
      switch (sort) {
        case 'alphabetical':
        case 'categorical':
          worker.postMessage({
            sort: sort,
            apps: apps
          })
          break
        case 'popularity':
          worker.postMessage({
            sort: sort,
            apps: apps,
            downloadCounts: that.db.apps.downloadCounts
          });
          break;
        case 'ratings':
          worker.postMessage({
            sort: sort,
            apps: apps,
            ratings: that.db.apps.ratings
          });
          break;
        default:
          console.warn('[StoreDb] Unable to sort, returning unsorted apps.')
          resolve(apps);
          break;
      }
    })
  }

  searchApps (query) {
    const that = this;
    return new Promise((resolve, reject) => {
      const worker = new Worker("assets/js/lib/storedb/workers/search-worker.js");
      worker.onmessage = (e) => {
        worker.terminate();
        resolve(e.data);
      }
      worker.onerror = (err) => {
        worker.terminate();
        reject(err);
      }
      worker.postMessage({
        query: query,
        apps: that.db.apps.objects
      });
    });
  }

  async dlCountApp (appSlug) {
    await fetch(`${this.currentRatingServer.url}/download_counter/count/${appSlug}`);
  }

  async getAppRatings (appID) {
    const rawRatings = await fetch(`${this.currentRatingServer.url}/ratings/${appID}`)
    if (!rawRatings.ok) throw new Error(`Unable to fetch ratings for app ${appID}.`);
    return await rawRatings.json();
  }

  async loginToRatingsAccount (ausername, alogintoken) {
    const rawLoginRequest = await fetch(`${this.currentRatingServer.url}/checkuser`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: ausername,
        logintoken: alogintoken
      })
    });
    if (!rawLoginRequest.ok) throw new Error("Unable to login.");
  }

  async createRatingsAccount (ausername, alogintoken) {
    const rawCreateRequest = await fetch(`${this.currentRatingServer.url}/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: ausername,
        logintoken: alogintoken
      })
    });
    if (!rawCreateRequest.ok) throw new Error("Unable to create account.");
  }

  async addNewRating (ausername, alogintoken, rappid, rpoints, rdescription) {
    const rawNewRatingRequest = await fetch(`${this.currentRatingServer.url}/ratings/${rappid}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: ausername,
        logintoken: alogintoken,
        points: rpoints,
        description: rdescription
      })
    });
    if (!rawNewRatingRequest.ok) throw new Error(`Unable to create new rating for app ${rappid}.`)
  }
}
