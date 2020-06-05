const express = require('express')
const author = require('./author.js')

const app = express()  // 创建一个express对象

app.use(author())  ////验证服务器有效性

app.listen(3000, () => console.log('server is start'))