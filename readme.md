# Bandcamp Scraper

Inspired by
https://github.com/easlice/bandcamp-downloader.

I wrote my own scraper so that I can run it on
(Termux)[https://termux.dev/en/] on Android without the
`curl-impersonate` dependency.

## Prerequisite: download cookies

First, you will need to log in to bandcamp.com and
use a browser extension like `cookies.txt` to export
your bandcamp.com cookies.

## Local dev

```
yarn
yarn dev
```

## Build and run

```
yarn build
node ./dist/index.js
```

## Usage

```
node ./dist/index.js \
  --cookies [path to bandcamp cookies file]
  --queryLimit [how many items to retrieve from your collection]
  --days [how far back to look in your collection for purchases]
  --downloadDir [where to download your collection's .zip files]
  --extractDir [where to extract the .zip files]
  --redownload [true|false, redownload .zip files already on disk]
  --reextract [true|false, unzip .zip files if destination already exists]
```
