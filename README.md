
## SPA单页面应用

### 1. 什么是单页面应用？

单页面应用，`SPA` 全称 `Single Page Application`，一般也称为 **`CSR`**`（Client Side Render）`，即客户端渲染。它所需的资源，如 `HTML`、`CSS` 和 `JS` 等，在第一次请求初始化时加载，加载完成后便不会再重新渲染整个页面。对于 `SPA` 来说，页面的切换就是组件或视图之间的切换。

### 2. 什么是多页面应用？

多页面应用 ，`MPA`全称`MultiPage Application` ，指有多个独立页面的应用（多个`html`页面），每个页面必须重复加载`js`、`css`等相关资源。对于 `MPA` 来说，页面的切换需要整页资源刷新。

### 3. SPA 的优缺点

优点

*   用户体验好
*   开发效率高
*   渲染性能好
*   可维护性高

缺点

*   首屏渲染时间长
*   不利于seo

### 4. 解决方案 - 同构渲染（现代化的服务端渲染）

针对`SPA`应用的首屏渲染时间长和不利于`SEO`检索的问题，可利用服务端渲染（`SSR`）进行优化

## 传统的服务端渲染

> 早期的`web`页面渲染都是在服务端进行的

### 一. 传统的服务端渲染流程

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/820ec03d6c6b42509fb545c8602ea376~tplv-k3u1fbpfcp-watermark.image?)

### 二. 通过Node.js演示传统的服务端渲染模式

#### 1. 新建项目

```shell
# 新建一个ssr-study的文件夹，存放此次学习的代码
$ mkdir ssr-study
$ cd ssr-study
```

新建文件夹`node-server-rendering`

```shell
# 创建 node-server-rendering 文件夹
$ mkdir node-server-rendering
$ cd node-server-rendering
```

在`node-server-rendering`目录下，新建`data.json`文件和`index.html`文件

*   `data.json`文件用于模拟数据库数据

```json
{
  "title":"前端三剑客",
  "posts":[
    {
      "id":1,
      "title":"HTML",
      "content":"HTML的全称为超文本标记语言，是一种标记语言。\n它包括一系列标签，通过这些标签可以将网络上的文档格式统一，使分散的Internet资源连接为一个逻辑整体。\nHTML文本是由HTML命令组成的描述性文本，HTML命令可以说明文字，图形、动画、声音、表格、链接等。"
    },
    {
      "id":2,
      "title":"CSS",
      "content":"层叠样式表(英文全称：Cascading Style Sheets)是一种用来表现HTML（标准通用标记语言的一个应用）或XML（标准通用标记语言的一个子集）等文件样式的计算机语言。\nCSS不仅可以静态地修饰网页，还可以配合各种脚本语言动态地对网页各元素进行格式化。"
    },
    {
      "id":3,
      "title":"JavaScript",
      "content":"JavaScript（简称“JS”）是一种具有函数优先的轻量级，解释型或即时编译型的编程语言。\n虽然它是作为开发Web页面的脚本语言而出名，但是它也被用到了很多非浏览器环境中，JavaScript基于原型编程、多范式的动态脚本语言，并且支持面向对象、命令式、声明式、函数式编程范式。"
    }
  ]
}
```

*   `index.html`文件,即渲染的模版文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>体验传统服务端渲染</title>
</head>
<body>
  <h1>体验传统服务端渲染</h1>
</body>
</html>
```

#### 2. 使用`express`创建服务端

安装`express` ，使用`express`来创建`web`服务。

```shell
# 安装express
$ npm i express
```

在`node-server-rendering`目录下创建后端服务文件`index.js`

```js
 const express = require('express')

//  创建一个express实例
 const app = express()

//  添加路由
 app.get('/',(req,res) => {
  res.send('hello world')
 })

 app.listen(3000,() => console.log('server running...'))
```

#### 3. 启动服务

在控制台使用`node index.js` 命令启动服务

但是为了方便，我们也可以使用`nodemon`启动服务，`nodemon`可以在我们每次写完代码保存之后自动重启服务端。

```shell
# 全局安装nodemon 
$ npm i nodemon -g
# 使用nodemon启动服务
$ nodemon index.js
```

服务启动成功后，打开浏览器，访问`localhost:3000`，可以收到服务端的`hello world`。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98e0686a4c154b289f5530139cd38e63~tplv-k3u1fbpfcp-watermark.image?)

#### 4. 把模版和数据结合

现在我们把第1步编写的`html`模版与`data.json`获取的数据进行结合，我们使用`nodejs`的`fs`模块读取文件，可以获取到模板`html`和数据`JSON`文件，然后借助第三方插件[`art-template`](https://aui.github.io/art-template/zh-cn/index.html)进行渲染。

```shell
# 安装第三方渲染引擎:art-template
$ npm i art-template
```

```js
// index.js
const express = require('express')   
const fs = require('fs')                 // ++
const template = require('art-template') // ++

//  创建一个express实例
const app = express()

//  添加路由
app.get('/', (req, res) => {

  // 1. 获取页面模版 - 使用nodejs的fs模块读取文件,
  // 为了简单起见，此处使用readFileSync同步方法读取文件
  const templateStr = fs.readFileSync('./index.html','utf-8')
  // fs.readFileSync默认是二进制文件流，所以要传入第二个参数utf-8,转换成字符串

  // 2. 获取数据
  const data = JSON.parse(fs.readFileSync('./data.json','utf-8'))
  
  // 3. 渲染：数据 + 模版 = 渲染结果
  // render方法接收两个参数，第一个是要渲染的模版字符串，第二个是数据对象；返回一个html
  const html = template.render(templateStr, data)

  // 4. 把渲染结果发送给客户端
  res.send(html)
})

app.listen(3000, () => console.log('server running...'))
```

使用`art-template`模版语法改写模版文件`index.html`，
具体的`art-template`用法可参考☞<https://aui.github.io/art-template/zh-cn/index.html>

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>体验传统服务端渲染</title>
</head>
<body>
  <h1>体验传统服务端渲染</h1>
  <!-- 将数据里的title渲染到这里 -->
  <h2>{{ title }}</h2>
  <ul>
    <!-- each 循环  -->
    {{ each posts }}
      <!-- $value 获取循环的每一项 -->
    <li>{{ $value.title }}</li>
    <!-- /each 循环结束 -->
    {{ /each }}
  </ul>
</body>
</html>
```
刷新浏览器，可以看到渲染的结果

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3998848f581e4dd187479bec451d3a40~tplv-k3u1fbpfcp-watermark.image?)

#### 5. 传统服务端渲染存在的问题
通过这个模拟过程，可以发现传统服务端渲染存在的一些问题：
- 前后端代码完全耦合在一起，不利于开发和维护
- 前端没有足够发挥空间
- 服务端压力大
- 用户体验一般

## 客户端渲染

> 客户端渲染得益于`AJax`技术的发展，`Ajax`使得客户端动态获取数据成为可能

客户端渲染实现了前后端分离

*   后端：负责处理数据接口
*   前端：负责将接口数据渲染到页面中

### 一、客户端渲染流程


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f43ca4b522114ad6aa54a9700e9a8d42~tplv-k3u1fbpfcp-watermark.image?)


### 二、使用Vue项目进行客户端渲染

#### 1. 新建一个Vue项目
> 此处是用Vue-Cli创建的Vue2项目，也可以用Vue3来体验
```shell
# 在ssr-study目录下
# 新建vue2项目 
$ vue create vue-client-rendering
# 安装router （可以在创建项目时，勾选安装，若未勾选可以使用以下命令安装）
$ vue add router
```
#### 2. 修改Vue项目
- 修改App.vue文件
```html
<template>
    <div id="app">
        <nav>
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </nav>
        <router-view/>
     </div>
</template>
```

    - 复制之前的`data.json`文件放在`public`目录下
    - 安装`axios`并修改`views/HomeView.vue`
```shell
# 安装axios
$ npm i axios
```
```html
    <template>
      <div class="home">
        <h2>{{ title }}</h2>
        <ul>
          <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
        </ul>
      </div>
    </template>

    <script>
    import axios from 'axios'

    export default {
      name:'App',
      data(){
        return {
          title:'',
          posts:[]
        }
      },
      async created(){
        const {data} = await axios({
          method:'GET',
          url:'../data.json'
        })
        this.title = data.title
        this.posts = data.posts
      }
    }
    </script>
```

#### 3. 启动项目
使用命令`npm run serve`启动项目,
打开浏览器：`localhost:8080`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b04a0b009255409898eeefe86cc54439~tplv-k3u1fbpfcp-watermark.image?)
   
#### 4. 为什么首屏渲染慢？
在快速网络的情况下，针对服务端渲染(`≈8ms`)和客户端渲染(`≈12ms`)的首屏加载时间差距并不是很大。

所以我们利用浏览器调试工具来模拟慢速网络下，看二者首屏加载的时间。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/885c0c6d57a54f09a1868bfc46bc11b8~tplv-k3u1fbpfcp-watermark.image?)
- 客户端渲染`SPA`首屏加载耗时大约`17s`，有三次`http`请求周期
- 首先加载空的`html`文件使用了`2.02s`
- 加载`js`文件使用了`13.30s`（这步加载结束时，页面已经渲染出了`Home|About`）
- `ajax`请求数据使用了`2.05s`（请求到数据后才渲染出前端三剑客的内容）

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/219bb45fa95844d684b632a50164bba3~tplv-k3u1fbpfcp-watermark.image?)
- 服务端渲染首屏加载耗时大约`2s`
- 服务端渲染只需要有一次`http`请求周期，即请求渲染好的`html`文件

#### 5. `SPA`为什么不利于`SEO`?
- 搜索引擎说怎么获取网页内容的？
   
     使用`nodejs`简单模拟搜索引擎的工作

    ```js
    // 新建seo/index.js文件 
    // 搜索引擎说怎么获取网页内容的？
    const http = require('http')

    // 搜索引擎 - 获取网页内容、分析、收录
    // 通过程序获取指定的网页内容

    // http.get('http://localhost:8080/',res => {
    http.get('http://localhost:3000/',res => {
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end',() => {
        console.log(data);
      })
    })
    ```

- 获取`localhost:3000`的服务端渲染的网页

    ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30d13ac4a7054d06b9e4b31e7429e3b4~tplv-k3u1fbpfcp-watermark.image?)
- 获取`localhost:8080`的客户端渲染的网页

    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/036fbf21f06148aebc5d7b0dffa010c6~tplv-k3u1fbpfcp-watermark.image?)
客户端的内容，是必须要解析执行`chunk-vendors.js`和`app.js`才能渲染出网页的内容

## 现代化的服务端渲染 （同构渲染）

> 同构渲染 = 后端渲染 + 前端渲染

*   基于`React`、`Vue`等框架，客户端渲染和服务端渲染的结合

    *   在服务器端执行一次，用于实现服务端渲染（首屏直出）
    *   在客户端再执行一次，用于接管页面交互

*   核心解决`SEO`和首屏渲染慢的问题

*   拥有传统服务端渲染的优点，也有客户端渲染的优点

### 一、现代服务端渲染的流程
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85685d7cbc5046c29b89611f7611eae8~tplv-k3u1fbpfcp-watermark.image?)


### 二、通过`Nuxt`体验同构渲染

*   `React`生态`Next.js`
*   `Vue`生态`Nuxt.js`

#### 1. 新建Nuxt项目
```shell
   # 新建目录
   $ mkdir ssr
   $ cd ssr
   # 生成package.json文件
   $ npm init -y
   # 安装 nuxt2
   $ npm i nuxt@2  
   # 修改package.json文件
```
 添加启动脚本命令
```json
    ...
      "scripts": {
        "dev":"nuxt"
      }
    ...
```
#### 2. 创建`pages`目录，并在该目录下创建`index.vue`

   > `Nuxt.js` 会依据 `pages` 目录中的所有 `*.vue` 文件生成应用的路由配置。

```html
    <template>
      <div class="home">
        <h2>{{ title }}</h2>
        <ul>
          <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
        </ul>
      </div>
    </template>

    <script>
    import axios from 'axios'

    export default {
      name:'App',
      // Nuxt中特殊提供的一个钩子函数，专门用于服务端渲染获取数据
      async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
        const { data } = await axios({
          method:'GET',
          url:'http://localhost:3000/data.json'
        })
        return data
      }
    }
    </script>
```
   我们用到了`axios`，还是需要安装一下`axios`，`npm i axios`。

#### 3. 启动服务 `npm run dev`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27f9ba4b851f4b6ba14e61408e70cda9~tplv-k3u1fbpfcp-watermark.image?)
可以看到内容是直接有服务端渲染的，在返回的`HTML`文件里有这些元素内容。

#### 4. 它还是单页面应用吗？

   新建`layouts`文件夹，在里面新建`default.vue`文件
```html
    <template>
      <div>
        <ul>
          <li>
            <!-- 类似于router-link -->
            <nuxt-link to="/">Home</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/about">About</nuxt-link>
          </li>
        </ul>
        
        <!-- 子页面出口 -->
        <nuxt/>
      </div>

    </template>

    <script>
    export default {}
    </script>
```
在`pages`文件夹里，新建一个`about.vue`文件
```html
<template>
      <div>
        <h1>About</h1>
      </div>
    </template>

    <script>
    export default {}
    </script>
```
重启项目，此时我们通过`Home`和`About`切换，可以观察到页面没有刷新，所以它依旧是单页面应用程序。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb52125325c041d3b5c1cdd30f4f4ec3~tplv-k3u1fbpfcp-watermark.image?)

### 三、同构渲染的问题

*   开发条件所限

    *   浏览器特定的代码只能在某些生命周期钩子函数中使用
    *   一些外部扩展库可能需要特殊处理才能在服务端渲染应用中运行
    *   不能在服务端渲染期间操作`DOM`

*   涉及构建设置和部署的更多要求

    *   只能部署在`Node.js Server`

*   更多的服务器负载

所以是否真的需要服务端渲染，要取决于“首屏渲染速度是否对我们的项目很重要”，或者是“有SEO的需求”。
