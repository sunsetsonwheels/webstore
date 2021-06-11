const { series, parallel, src, dest } = require('gulp')
const log = require('fancy-log')
const plumber = require('gulp-plumber')
const rm = require('del')
const rename = require('gulp-rename')
const minifyJS = require('gulp-terser')
const minifyJSON = require('gulp-jsonminify')
const minifyCSS = require('gulp-clean-css')
const minifyHTML = require('gulp-html-minifier-terser')

const SOURCE_FOLDER = 'src/'
const BUILD_FOLDER = 'docs/'

const FPATHS = {
  js: {
    src: SOURCE_FOLDER + 'assets/js/**/*.js',
    src_min: SOURCE_FOLDER + 'assets/js/**/*.min.js',
    dest: BUILD_FOLDER + 'assets/js/'
  },
  css: {
    src: SOURCE_FOLDER + 'assets/css/**/*.css',
    src_min: [SOURCE_FOLDER + 'assets/css/**/*.min.css',
      SOURCE_FOLDER + 'assets/css/**/*.eot',
      SOURCE_FOLDER + 'assets/css/**/*.svg',
      SOURCE_FOLDER + 'assets/css/**/*.ttf',
      SOURCE_FOLDER + 'assets/css/**/*.woff',
      SOURCE_FOLDER + 'assets/css/**/*.woff2'],
    dest: BUILD_FOLDER + 'assets/css/'
  },
  html: {
    src: SOURCE_FOLDER + '*.html',
    dest: BUILD_FOLDER
  },
  icons: {
    src: SOURCE_FOLDER + 'assets/icons/**/*.png',
    dest: BUILD_FOLDER + 'assets/icons/'
  },
  logos: {
    src: SOURCE_FOLDER + 'assets/logos/**/*.png',
    dest: BUILD_FOLDER + 'assets/logos/'
  },
  locales: {
    src: SOURCE_FOLDER + 'assets/locales/*.json',
    dest: BUILD_FOLDER + 'assets/locales/'
  },
  manifest: {
    src: SOURCE_FOLDER + 'bhackers.webmanifest',
    dest: BUILD_FOLDER
  },
  cname: {
    src: SOURCE_FOLDER + 'CNAME.txt',
    dest: BUILD_FOLDER
  }
}

function onErr (err) {
  const constructMessage = 'An error occured in gulp:\n\n' + err.toString()
  log.error(constructMessage)
  process.exit(-1)
}

function jsTask () {
  return src(FPATHS.js.src)
    .pipe(plumber({ errorHandler: onErr }))
    .pipe(minifyJS())
    .pipe(plumber.stop())
    .pipe(dest(FPATHS.js.dest))
}

function jsMinTask () {
  return src(FPATHS.js.src_min)
    .pipe(plumber({ errorHandler: onErr }))
    .pipe(plumber.stop())
    .pipe(dest(FPATHS.js.dest))
}

function cssTask () {
  return src(FPATHS.css.src)
    .pipe(plumber({ errorHandler: onErr }))
    .pipe(minifyCSS())
    .pipe(plumber.stop())
    .pipe(dest(FPATHS.css.dest))
}

function cssMinTask () {
  return src(FPATHS.css.src_min)
    .pipe(plumber({ errorHandler: onErr }))
    .pipe(plumber.stop())
    .pipe(dest(FPATHS.css.dest))
}

function htmlTask () {
  return src(FPATHS.html.src)
    .pipe(plumber({ errorHandler: onErr }))
    .pipe(minifyHTML())
    .pipe(plumber.stop())
    .pipe(dest(FPATHS.html.dest))
}

function iconsTask () {
  return src(FPATHS.icons.src)
    .pipe(plumber({ errorHandler: onErr }))
    .pipe(plumber.stop())
    .pipe(dest(FPATHS.icons.dest))
}

function logosTask () {
  return src(FPATHS.logos.src)
    .pipe(plumber({ errorHandler: onErr }))
    .pipe(plumber.stop())
    .pipe(dest(FPATHS.logos.dest))
}

function localesTask () {
  return src(FPATHS.locales.src)
    .pipe(plumber({ errorHandler: onErr }))
    .pipe(plumber.stop())
    .pipe(dest(FPATHS.locales.dest))
}

function manifestTask () {
  return src(FPATHS.manifest.src)
    .pipe(plumber({ errorHandler: onErr }))
    .pipe(minifyJSON())
    .pipe(rename('bhackers.webmanifest'))
    .pipe(plumber.stop())
    .pipe(dest(FPATHS.manifest.dest))
}

function cnameTask () {
  return src(FPATHS.cname.src)
    .pipe(plumber({ errorHandler: onErr }))
    .pipe(rename('CNAME'))
    .pipe(plumber.stop())
    .pipe(dest(FPATHS.cname.dest))
}

function cleanBuildAll () {
  return rm([BUILD_FOLDER + '*', '!' + BUILD_FOLDER + 'CNAME'])
}

const DEFAULT_BUILD_TASKS = parallel(jsTask, jsMinTask, cssTask, cssMinTask, htmlTask, iconsTask, logosTask, localesTask, manifestTask, cnameTask)

exports.clean = cleanBuildAll

exports.default = series(cleanBuildAll, DEFAULT_BUILD_TASKS)
