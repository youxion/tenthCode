/*
 * 工具函数
  * */

const {parseString} = require('xml2js') //将xml数据转换为js对象,parseString为xml2js里的一个函数

module.exports = {

  //获取用户发送的消息
  getUserDataAsync(req) {
    return new Promise((resolve, reject) => {
        let xmlData = ''
        req
          .on('data', data => { //只要有流式数据data传送过来，就会触发当前函数

            //将buffer形式的数据，转换为字符串
            xmlData += data.toString() //将每次传送过来的data累加

            console.log(data)


          })
          .on('end', () => { //data传输完成时，会触发当前函数。
            resolve(xmlData)
          })
      }
    )
  },

  //将xml数据转换为js对象
  parseXMLasync(xmlData) {
    return new Promise((project, reject) => {
      parseString(xmlData, {trim: true}, (err, data) => {
        if (!err) { //如果解析数据成功
          project(data)


        } else {  //解析数据失败
          reject('parseString解析数据失败' + err)

        }
      })

    })

  },

  //将js对象数据进行格式化
  formatMessage(jsData) {
    let message = {}
    jsData = jsData.xml

    if (typeof jsData === 'object') {
      for (let key in jsData) {
        let value = jsData[key]
        if (Array.isArray(value) && (value.length > 0)) {  //value为数组且里面有内容
          message[key] = value[0]

        }
      }
    } else {

    }
    return message
    

  }
}

