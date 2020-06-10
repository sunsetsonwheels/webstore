# webstore
Web client for BananaHackers Store

![shields.io Last Commit badge](https://img.shields.io/github/last-commit/jkelol111/webstore)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Features

![Apps list screenshot](https://github.com/jkelol111/webstore/raw/master/screenshots/apps.png)

List apps from [BananaHackers' main GitLab store-db](https://gitlab.com/banana-hackers/store-db) instance, or the [community mirror on GitHub](https://github.com/bananahackers/bananahackers.github.io) & filter apps by categories.

![App info screenshot](https://github.com/jkelol111/webstore/raw/master/screenshots/info.png)

View apps information.

![App download screenshot](https://github.com/jkelol111/webstore/raw/master/screenshots/download.png)

Download apps manually, or by using perry's KaiOS Alt App Store client + download QR code.

## Building

The WebStore can be run directly from `src/index.html` in this Git repository. For GitHub pages hosting, you will need to build it (run these commands relative to the project directory):

- Install build dependencies:
```bash
sudo npm install -g gulp-cli
npm install
```
- Build the project:
```bash
gulp
```

and of course enable GitHub Pages and set it to host from `docs/`. You will need to run the 'Build the project' step every commit to have the changes from `src/` be reflected on GitHub Pages.

## Contributing

Please refer to `CONTRIBUTING.md` in this Git repository, but tldr here for anyone too lazy to read:

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

- We use Standard JS code style. Please make use of it in your contributions.
- Respect others and maintain the code of conduct. Please read `CODE_OF_CONDUCT.md` in this Git repository.

## License

[![GPLv3 logo](https://www.gnu.org/graphics/gplv3-127x51.png)](https://www.gnu.org/licenses/gpl-3.0.html)

This project is licensed under the GPLv3 license. A copy is included in `LICENSE.txt` in this Git repository.

## Credits & thanks

This project wouldn't have been possible without the following resources and projects:

- Bulma by [@jgthms](https://github.com/jgthms): https://bulma.io/
- QRCodeJS by [@davidshimjs](https://github.com/davidshimjs): https://github.com/davidshimjs/qrcodejs
- Font Awesome 5: https://fontawesome.com/
- Animate.CSS: https://github.com/animate-css/animate.css

and all the people at BananaHackers, 40min, perry and shangul for maintaining the BananaHackers Store on GitLab and GitHub, and of course, all the Mozilla Developer Network documentation ;)