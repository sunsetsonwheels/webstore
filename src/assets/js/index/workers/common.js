'use strict'

const fixedHeaders = {
  'Content-Type': 'application/json'
}

function wLog (type, message) {
  const logMessage = `[${WORKER_NAME} Worker] ${message}`
  switch (type) {
    case 'log':
    default:
      console.log(logMessage)
      break
    case 'warning':
      console.warn(logMessage)
      break
    case 'error':
      console.error(logMessage)
      break
  }
}

function syncRequest(requestDetails) {
  var xhr = new XMLHttpRequest()
  xhr.open(requestDetails.type, requestDetails.url, false)
  if (requestDetails.headers) {
    for (const header in requestDetails.headers) {
      xhr.setRequestHeader(header, requestDetails.headers[header])
    }
  }
  xhr.timeout = requestDetails.timeout
  xhr.send(requestDetails.body)

  var returnObject = {
    success: false,
    data: null,
    error: null
  }

  if (xhr.status >= 200 && xhr.status < 300) {
    returnObject.success = true
    returnObject.data = xhr.responseText
  } else {
    returnObject.error = xhr.status
  }

  return returnObject
}

function syncJSONRequest (requestDetails) {
  const request = syncRequest(requestDetails)
  if (request.data) {
    try {
      request.data = JSON.parse(request.data)
    } catch (err) {
      console.warn('Could not parse JSON response: ' + err)
    }
  } else {
    console.warn('No data received from request!')
  }

  return request
}