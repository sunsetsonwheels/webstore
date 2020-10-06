function wLog (type, message) {
  switch (type) {
    case 'log':
    default:
      console.log('[Worker] ', message)
      break
    case 'warning':
      console.warn('[Worker] ', message)
      break
    case 'error':
      console.error('[Worker] ', message)
      break
  }
}