'use strict'

onmessage = (e) => {
  const categoryApps = {};
  for (const [app, appDetails] of Object.entries(e.data.apps)) {
    if (appDetails.meta.categories.includes(e.data.category)) {
      categoryApps[app] = appDetails;
    }
  }
  postMessage(categoryApps);
}