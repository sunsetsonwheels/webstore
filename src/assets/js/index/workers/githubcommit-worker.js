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
  var ghDataCommitSha = null
  if (request.success) {
    try {
      ghDataCommitSha = request.data.object.sha
      wLog('log', 'Received successful response from GitHub.')
      if (ghDataCommitSha) {
        postMessage(ghDataCommitSha)
      } else {
        wLog('warning', 'No GitHub commit hash found.')
      }
    } catch (err) {
      wLog('error', 'Error parsing response from GitHub')
    }
  } else {
    wLog('error', 'Error making request to GitHub.')
  }
  wLog('log', 'GitHub commit worker completed!')
  postMessage(ghDataCommitSha)
}