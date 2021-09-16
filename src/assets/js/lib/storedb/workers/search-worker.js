'use strict';

onmessage = (e) => {
  var queriedApps = {}
  const queryStringLowered = e.data.query.toLowerCase()
  for (const [app, appDetails] of Object.entries(e.data.apps)) {
    if (appDetails.name.toLowerCase().includes(queryStringLowered) || 
        appDetails.description.toLowerCase().includes(queryStringLowered) ||
        appDetails.meta.tags.includes(e.data.query)) {
          queriedApps[app] = appDetails;
    }
  }
  postMessage(queriedApps);
}