importScripts('wlog.js')

onmessage = (e) => {
  wLog('log', 'Ratings worker started.')
  switch (e.data.cmd) {
    case 'count':
      wLog('log', 'Selected command "count".')
      if (e.data.slug) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://bhackers.uber.space/srs/v1/download_counter/count/' + e.data.slug, false)
        xhr.timeout = 2000
        xhr.send()
        if (xhr.status >= 200 && xhr.status < 300) {
          wLog('log', 'Download count for slug "' + e.data.slug + '" recorded successfully.')
        } else {
          wLog('warning', 'Download count for slug "' + e.data.slug + '" failed to record (xhr status: ' + xhr.status + ').')
        }
      } else {
        wLog('error', 'Slug not supplied for count command, not performing count!')
      }
      break
  }
  wLog('log', 'Ratings worker completed')
  postMessage(null)
}
