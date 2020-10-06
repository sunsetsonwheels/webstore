'use strict'

function syncJSONRequest (requestDetails) {
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
  } else {
    returnObject.error = xhr.status
  }
  if (xhr.responseText) {
    returnObject.data = JSON.parse(xhr.responseText)
  }

  return returnObject
}