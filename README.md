# Prerender Request Blacklist

This is a plugin to be used with your Prerender server to avoid requesting to any blacklist extensions such as image, css, fonts etc

## Install

![npm install](https://nodei.co/npm/prerender-request-blacklist.png)

`npm install prerender-request-blacklist --save`

**server.js**

```javascript
const prerender = require('prerender');
const server = prerender();

server.use(require('prerender-request-blacklist'));

server.start();
```

**Test it**

`curl http://localhost:3000/render?url=https://www.example.com/`

## Options

List of blacklist data separated by `,` 

```bash
export BLACKLISTED_EXTS=css,jpg
export BLACKLISTED_DOMAIN=google.com
export BLACKLISTED_MATCH=regex_pattern
```


For example:

```bash
export BLACKLISTED_EXTS=ico,jpg,jpeg,png,ttf,eot,otf,woff,woff2,gif,svg,pdf,css,svg
export BLACKLISTED_DOMAIN=www.googletagmanager.com,googletagmanager.com,www.google-analytics.com,google-analytics.com,connect.facebook.net,lc.iadvize.com,fonts.gstatic.com,gstatic.com,i.ytimg.com,www.youtube.com,vimeo.com,www.vimeo.com,baidu.com,f.vimeocdn.com,fresnel.vimeocdn.com,player.vimeo.com,i.vimeocdn.com,youtube.com,player.youtube.com,stats.g.doubleclick.net,static.iadvize.com,api.iadvize.com
export BLACKLISTED_MATCH=^[^ignore]+$
```
