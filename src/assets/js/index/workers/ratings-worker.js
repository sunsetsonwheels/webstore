importScripts('wlog.js')

onmessage = (e) => {
  wLog('log', 'Ratings worker started.')

  var returnMessage = {
    success: false,
    response: {}
  }

  switch (e.data.command) {
    case 'count':
      wLog('log', 'Selected command "count".')
      if (e.data.slug) {
        wLog('log', 'Making request to download counts tracker.')
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://bhackers.uber.space/srs/v1/download_counter/count/' + e.data.slug, false)
        xhr.timeout = 2000
        xhr.send()
        if (xhr.status >= 200 && xhr.status < 300) {
          returnMessage.success = true
          wLog('log', 'Download count for slug "' + e.data.slug + '" recorded successfully.')
        } else {
          wLog('warning', 'Download count for slug "' + e.data.slug + '" failed to record (xhr status: ' + xhr.status + ').')
        }
      } else {
        wLog('error', 'Slug not supplied for count command, not performing count!')
      }
      break
    case 'login':
      wLog('log', 'Selected command "login".')
      if (e.data.args.username && e.data.args.logintoken) {
        wLog('log', 'Making request to ratings server.')
        var xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://bhackers.uber.space/srs/v1/createuser', false)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({
          username: e.data.username,
          logintoken: e.data.logintoken
        }))
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            returnMessage.response = JSON.parse(xhr.responseText)
            if (returnMessage.response.success) {
              returnMessage.success = true
              wLog('log', 'Created user on ratings server successfully!')
            } else {
              wLog('error', 'Could not create user on ratings server: ' + returnMessage.response.error)
            }
          } catch (err) {
            wLog('error', 'Error parsing response from ratings server: ' + err)
          }
        } else {
          wLog('error', 'Error making request to ratings server: ' + xhr.status)
        }
      } else {
        wLog('error', 'Not enough arguments provided for login command, not doing anything!')
      }
      break
    case 'add':
      wLog('log', 'Selected command "add".')
      if (e.data.args.username && e.data.args.logintoken && e.data.args.appid && e.data.args.points && e.data.args.description) {
        wLog('log', 'Making request to ratings server.')
        var xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://bhackers.uber.space/srs/v1/ratings/' + e.data.appid + "/add", false)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.open(JSON.stringify({
          username: e.data.args.username,
          logintoken: e.data.args.logintoken,
          appid: e.data.args.appid,
          points: e.data.args.points,
          description: e.data.args.description
        }))

      }
      break
  }
  wLog('log', 'Ratings worker completed')
  postMessage(returnMessage)
}
