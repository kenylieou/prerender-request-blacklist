# prerender extension blacklist

This is a plugin to be used with your Prerender server to avoid requesting to any blacklist extensions such as image, css, fonts etc

## Install

`npm install prerender-extension-blacklist --save`

**server.js**

```javascript
const prerender = require('prerender');
const server = prerender();

server.use(require('prerender-extension-blacklist'));

server.start();

```

**Test it**

`curl http://localhost:3000/render?url=https://www.example.com/`

## Options

List of extension separate by "," 

`export BLACKLISTED_EXTS=css,jpg`

For example:

`export BLACKLISTED_EXTS=ico,jpg,jpeg,png,ttf,eot,otf,woff,woff2,gif,svg,pdf,css,svg`
