const WORKER_NAME = "Github Commit"

importScripts('common.js')

onmessage = function () {
  wLog('log', 'GitHub commit worker started.')
  wLog('log', 'Making request to GitHub.')
  const request = syncJSONRequest({
    type: 'GET',
    url: 'https://api.github.com/repos/jkelol111/webstore/git/refs/heads/master',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (request.success) {
    try {
      var ghDataCommitSha = request.data.object.sha
      wLog('log', 'Received successful response from GitHub.')
      if (ghDataCommitSha) {
        postMessage(ghDataCommitSha)
      } else {
        postMessage(null)
      }
    } catch (err) {
      wLog('error', 'Error parsing response from GitHub')
      postMessage(null)
    }
  } else {
    wLog('error', 'Error making request to GitHub.')
    postMessage(null)
  }
}