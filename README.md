# 公寓平台

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

数据库文件在apartment\service\common下的sql文件，我用的是mysql数据库，将数据库文件导入mysql。
管理员账号：admin，密码：123
房东账号：房东，密码：123
租客账号：demo，密码：123
也可以自行注册。
启动时，除了启动项目外，还要启动服务器。
1.启动命令行进入项目文件夹然后输入npm run dev
2.启动新的命令行进入项目文件夹的service，输入npm start。
![启动service](https://github.com/leeyanzzzzzu/apartment/blob/master/src/assets/img1/1.jpg)
