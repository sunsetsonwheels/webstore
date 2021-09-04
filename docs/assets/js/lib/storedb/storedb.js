class StoreDatabaseAPI{constructor(){this.stores=["https://banana-hackers.gitlab.io/store-db/data.json","https://bananahackers.github.io/store-db/data.json","https://bananahackers.github.io/data.json"],this.ratingServers=["https://bhackers.uber.space/srs/v1"],this.currentStore={index:0,url:this.stores[0]},this.currentRatingServer={index:0,url:this.ratingServers[0]},this.db={categories:{all:{name:i18next.t("all-apps"),icon:"fas fa-store"}},apps:{objects:{},downloadCounts:{},ratings:{}},generatedAt:null}}async loadDb(){for(const t of this.stores){const e=await fetch(t);if(!e.ok)continue;this.currentStore.index=this.stores.indexOf(t),this.currentStore.url=t;const s=await e.json();if([2,3].includes(s.version)){this.db.generatedAt=s.generated_at,this.db.categories.all={name:i18next.t("all-apps"),icon:"fas fa-store"},Object.assign(this.db.categories,s.categories);for(const t of s.apps)this.db.apps.objects[t.name]=t;break}}for(const t of this.ratingServers){const e=await fetch(`${t}/download_counter`);if(!e.ok)continue;this.currentRatingServer.index=this.ratingServers.indexOf(t),this.currentRatingServer.url=t,this.db.apps.downloadCounts=await e.json();const s=await fetch(`${t}/ratings`);if(s.ok){this.db.apps.ratings=await s.json();break}}}getAppsByCategory(t){const e=this;return new Promise(((s,r)=>{this.db.categories.hasOwnProperty(t)||r(new Error('Category "'+t+'" does not exist!')),"all"==t&&s(this.db.apps.objects);const a=new Worker("assets/js/lib/storedb/workers/category-worker.js");a.onmessage=t=>{a.terminate(),s(t.data)},a.onerror=t=>{a.terminate(),r(t)},a.postMessage({apps:e.db.apps.objects,category:t})}))}sortApps(t,e){const s=this;return new Promise(((r,a)=>{const n=new Worker("assets/js/lib/storedb/workers/sort-worker.js");switch(n.onmessage=function(t){n.terminate(),r(t.data)},n.onerror=function(t){n.terminate(),a(t)},e){case"alphabetical":case"categorical":n.postMessage({sort:e,apps:t});break;case"popularity":n.postMessage({sort:e,apps:t,downloadCounts:s.db.apps.downloadCounts});break;case"ratings":n.postMessage({sort:e,apps:t,ratings:s.db.apps.ratings});break;default:console.warn("[StoreDb] Unable to sort, returning unsorted apps."),r(t)}}))}searchApps(t){const e=this;return new Promise(((s,r)=>{const a=new Worker("assets/js/lib/storedb/workers/search-worker.js");a.onmessage=t=>{a.terminate(),s(t.data)},a.onerror=t=>{a.terminate(),r(t)},a.postMessage({query:t,apps:e.db.apps.objects})}))}async dlCountApp(t){await fetch(`${this.currentRatingServer.url}/download_counter/count/${t}`)}async getAppRatings(t){const e=await fetch(`${this.currentRatingServer.url}/ratings/${t}`);if(!e.ok)throw new Error(`Unable to fetch ratings for app ${t}.`);return await e.json()}async loginToRatingsAccount(t,e){if(!(await fetch(`${this.currentRatingServer.url}/checkuser`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,logintoken:e})})).ok)throw new Error("Unable to login.")}async createRatingsAccount(t,e){if(!(await fetch(`${this.currentRatingServer.url}/createuser`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,logintoken:e})})).ok)throw new Error("Unable to create account.")}async addNewRating(t,e,s,r,a){if(!(await fetch(`${this.currentRatingServer.url}/ratings/${s}/add`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,logintoken:e,points:r,description:a})})).ok)throw new Error(`Unable to create new rating for app ${s}.`)}}