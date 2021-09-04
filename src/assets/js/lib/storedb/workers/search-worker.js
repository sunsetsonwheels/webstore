'use strict';

onmessage = (e) => {
  var queriedApps = {}
  for (const [app, appDetails] of Object.entries(e.data.apps)) {
    if (appDetails.name.includes(e.data.query) || 
        appDetails.description.includes(e.data.query) ||
        appDetails.meta.tags.includes(e.data.query)) {
          queriedApps[app] = appDetails;
    }
  }
  postMessage(queriedApps);
}