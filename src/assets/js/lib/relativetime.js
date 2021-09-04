'use strict';

// Solution adapted from:
// https://stackoverflow.com/a/53800501/13319205

class RelativeTime {
  constructor (language) {
    this.relativeTimeUnits = {
      year  : 24 * 60 * 60 * 1000 * 365,
      month : 24 * 60 * 60 * 1000 * 365 / 12,
      day   : 24 * 60 * 60 * 1000,
      hour  : 60 * 60 * 1000,
      minute: 60 * 1000,
      second: 1000
    }

    this.relativeTimeFormatter = this.getNewFormatter(language)
  }

  getNewFormatter(language) {
    return new Intl.RelativeTimeFormat(language, {
      localeMatcher: "best fit",
      numeric: "always",
      style: "long"
    })
  }

  setLanguage (language) {
    this.relativeTimeFormatter = this.getNewFormatter(language)
  }

  getRelativeTime (d1, d2=new Date()) {
    const diff = d1 - d2

    for (const unit in this.relativeTimeUnits) {
      if (Math.abs(diff) > this.relativeTimeUnits[unit] || unit === "second") {
        return this.relativeTimeFormatter.format(
          Math.round(diff / this.relativeTimeUnits[unit]), 
          unit
        )
      }
    }
  }
}