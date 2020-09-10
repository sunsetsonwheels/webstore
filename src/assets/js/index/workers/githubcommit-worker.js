onmessage = function () {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://api.github.com/repos/jkelol111/webstore/git/refs/heads/master', false)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send()
  if (xhr.status >= 200 && xhr.status < 300) {
    try {
      var ghDataCommitSha = JSON.parse(xhr.responseText).object.sha
      if (ghDataCommitSha) {
        postMessage(ghDataCommitSha)
      } else {
        postMessage(null)
      }
    } catch (err) {
      console.error('[GitHub Commit Worker] Error parsing response from store: ' + err)
      postMessage(null)
    }
  } else {
    console.error('[GitHub Commit Worker] Error making request to store: ' + xhr.status)
    postMessage(null)
  }
}