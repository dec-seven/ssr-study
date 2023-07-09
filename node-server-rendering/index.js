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
  const html = template.render(templateStr, data)

  // 4. 把渲染结果发送给客户端
  res.send(html)
})

app.listen(3000, () => console.log('server running...'))