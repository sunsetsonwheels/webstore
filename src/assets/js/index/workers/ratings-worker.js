const WORKER_NAME = "Ratings"

importScripts('common.js')

const jsonHeader = {
  'Content-Type': 'application/json'
}

onmessage = (e) => {
  wLog('log', 'Ratings worker started.')

  var returnMessage = {
    success: false,
    response: {}
  }

  switch (e.data.command) {
    case 'count':
      wLog('log', 'Selected command "count".')
      if (e.data.args.slug) {
        wLog('log', 'Making request to download counts tracker.')
        const request = syncRequest({
          type: 'GET',
          url: 'https://bhackers.uber.space/srs/v1/download_counter/count/' + e.data.slug,
          timeout: 2000
        })
        if (request.success) {
          returnMessage.success = true
          wLog('log', 'Download count for slug "' + e.data.args.slug + '" recorded successfully.')
        } else {
          wLog('warning', 'Download count for slug "' + e.data.args.slug + '" failed to record: ' + request.error)
        }
      } else {
        wLog('error', 'Slug not supplied for count command, not performing count!')
      }
      break
    case 'create':
      wLog('log', 'Selected command "create".')
      if (e.data.args.username && e.data.args.logintoken) {
        wLog('log', 'Making request to ratings server.')
        const request = syncJSONRequest({
          type: 'POST',
          url: 'https://bhackers.uber.space/srs/v1/createuser',
          headers: jsonHeader,
          body: JSON.stringify({
            username: e.data.args.username,
            logintoken: e.data.args.logintoken
          })
        })
        if (request.success) {
          returnMessage.success = true
        } else {
          if (request.error === 409) {
            wLog('error', 'The ratings server rejected the creation request.')
          } else {
            wLog('error', 'Error making request to ratings server: ' + request.error)
          }
        }
      }
      break
    case 'login':
      wLog('log', 'Selected command "login".')
      if (e.data.args.username && e.data.args.logintoken) {
        wLog('log', 'Making request to ratings server.')
        const request = syncJSONRequest({
          type: 'POST',
          url: 'https://bhackers.uber.space/srs/v1/checkuser',
          headers: jsonHeader,
          body: JSON.stringify({
            username: e.data.args.username,
            logintoken: e.data.args.logintoken
          })
        })
        if (request.success) {
          returnMessage.response = request
          if (returnMessage.response.success) {
            returnMessage.success = true
            wLog('log', 'Logged in user on ratings server successfully!')
          } else {
            wLog('error', 'Could not login user on ratings server: ' + returnMessage.response.error)
          }
        } else {
          if (request.error === 401) {
            wLog('error', 'The ratings server rejected the login request.')
          } else {
            wLog('error', 'Error making request to ratings server: ' + request.error)
          }
        }
      } else {
        wLog('error', 'Not enough arguments provided for login command, not doing anything!')
      }
      break
    
    case 'add':
      wLog('log', 'Selected command "add".')
      if (e.data.args.username && e.data.args.logintoken && e.data.args.appid && e.data.args.points && e.data.args.description) {
        wLog('log', 'Making request to ratings server.')
        const request = syncJSONRequest({
          type: 'POST',
          url: 'https://bhackers.uber.space/srs/v1/ratings/' + e.data.args.appid + '/add',
          headers: jsonHeader,
          body: JSON.stringify({
            username: e.data.args.username,
            logintoken: e.data.args.logintoken,
            points: e.data.args.points,
            description: e.data.args.description
          })
        })
        if (request.success) {
          returnMessage.response = request
          if (returnMessage.response.success) {
            returnMessage.success = true
            wLog('log', 'Recorded rating to ratings server successfully!')
          } else {
            wLog('error', 'Could not record ratings to server: ' + returnMessage.response.error)
          }
        } else {
          wLog('error', 'Error making request to ratings server: ' + request.error)
        }
      }
      break
    case 'get':
      wLog('log', 'Selected command "get".')
      if (e.data.args.appid) {
        wLog('log', 'Making request to ratings server.')
        const request = syncJSONRequest({
          type: 'GET',
          url: 'https://bhackers.uber.space/srs/v1/ratings/' + e.data.args.appid,
          headers: fixedHeaders
        })
        if (request.success) {
          returnMessage.response = request
          if (returnMessage.response.success) {
            returnMessage.success = true
            wLog('log', `Got ratings for app '${e.data.args.appid}' successfully!`)
          } else {
            wLog('error', `Could not get ratings for app "${e.data.args.appid}!"`)
          }
        } else {
          wLog('error', 'Error making request to ratings server: ' + request.error)
        }
      }
      break
  }
  wLog('log', 'Ratings worker completed')
  postMessage(returnMessage)
}
