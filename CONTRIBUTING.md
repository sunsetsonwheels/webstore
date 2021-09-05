# Contributing
Want to help us out? Follow these simple rules:

## License

[![GPLv3 logo](https://www.gnu.org/graphics/gplv3-127x51.png)](https://www.gnu.org/licenses/gpl-3.0.html)

This project is licensed under the GPLv3 license. Please consider this when adding external libraries/resources to the project.

## Code of conduct

Please read `CODE_OF_CONDUCTS.md` in this Git repository. Tldr:

- Please remain civil in discussions.
- Respect one another.
- Contact [@jkelol111's email](mailto:jkelol111@gmail.com) immediately when a breach of conduct codes occurs.

## Translating

Contributing translations to this project is not too difficult.

1. Make a copy of `src/assets/i18n/en.json` and rename it to the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code you're translating to (e.g `vi.json`, `tl.json`).
2. Translate the English on the right side of the copy you made to your language, just like the other translation files currently present in `src/assets/i18n`.
3. Add your language code into `src/assets/js/index/init.js`, where `i18next.init()` is. (into the `supportedLngs` array)
4. Add your language option into the `lang-select` selection box, in `src/index.html`.
4. Make a pull request and we'll verify it works and adjust it accordingly.
