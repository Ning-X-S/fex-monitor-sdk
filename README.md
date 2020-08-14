# Jarvis SDK

Jarvis 是一个监控系统， Jarvis SDK 是该系统的 web 端数据采集插件。

## 开始

第一版目标兼容 iOS 9+

## 开发

|命令|解释|
|---|---|
|dev|开发环境，会引用 public/index.html，webpack 会把代码插入在 head 标签最后|
|build:window|打包，jarvis-sdk.min.js，供 script 直接引入，暴露全局变量 Jarvis|
|build:umd|打包，jarvis-sdk.umd.min.js，供 import 引入|
|build:version|打包，jarvis-sdk.x.x.x.min.js，和 build:window 唯一不同就是产物有当前的版本号|
|build:nomini|打包，jarvis-sdk.nominimize.js，和 build:window 唯一不同就是代码未压缩|
|build:major|打包，jarvis-sdk.x.x.x.min.js，和 build:version 唯一不同就是更新 major 位的版本号|
|build:minor|打包，jarvis-sdk.x.x.x.min.js，和 build:version 唯一不同就是更新 minor 位的版本号|
|build:patch|打包，jarvis-sdk.x.x.x.min.js，和 build:version 唯一不同就是更新 patch 位的版本号|
|push:major|打包并提交，jarvis-sdk.x.x.x.min.js，和 build:version 不同的是更新 major 位的版本号，并打 tag，然后提交 git|
|push:minor|打包并提交，jarvis-sdk.x.x.x.min.js，和 build:version 不同的是更新 minor 位的版本号，并打 tag，然后提交 git|
|push:patch|打包并提交，jarvis-sdk.x.x.x.min.js，和 build:version 不同的是更新 patch 位的版本号，并打 tag，然后提交 git|

## vue支持

```javascript
window.jarvis && window.jarvis.vueErrorHandler(Vue)
```
