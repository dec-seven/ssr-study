// 搜索引擎说怎么获取网页内容的？
const http = require('http')

// 搜索引擎 - 获取网页内容、分析、收录
// 通过程序获取指定的网页内容
http.get('http://localhost:8080/',res => {
  let data = ''
  res.on('data', chunk => {
    data += chunk
  })
  res.on('end',() => {
    console.log(data);
  })
})