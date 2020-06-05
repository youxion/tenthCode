const sha1 = require('sha1')
const config = require('./config/config.js')
const {getUserDataAsync, parseXMLasync, formatMessage} = require('./utils/tools.js')
const template = require('./template.js')
const reply = require('./reply.js')


//验证服务器有效性
module.exports = () => {
  return async (req, res, next) => {
    console.log(1111111111111)
    // console.log(req)

    // 微信页面点击提交后，req.query里面有微信发送过来的{signature, echostr, timestamp, nonce}
    console.log(req.query)

    const {signature, echostr, timestamp, nonce} = req.query //存储微信发送过来的数据
    const {token} = config

    const arr = [timestamp, nonce, token]
    /*const arrSort = arr.sort()
    const str = arr.join('')
    const sha1Str = sha1(str)  //启用sha1加密算法*/
    const sha1Str = sha1(arr.sort().join('')) //数组排序、变成字符串、sha1加密

    /*
  *  get请求：验证服务器的有效性，
  *
  *  post请求: 微信服务器用post方式将用户的数据转发给开发者服务器。
  * */
    if (req.method === "GET") {
      if(sha1Str === signature){ //判断加密后的signature是否与微信发送过来signature的一样。
        console.log('微信get方式')
        res.send(echostr)

      }else{
        res.end('error')
      }

    }else if (req.method === "POST") {
      // 微信服务器用post方式将用户的数据转发给开发者服务器。

      /*
       { signature: '4b1c33fc98b875e74eb2184f5cbaebef51d92826',
        timestamp: '1587002775',
        nonce: '1063783404',
        openid: 'oYKkZwTD54mVsKXsw6a1QUuWvBKk' //用户的ID
        }
      */

      console.log('微信post方式')
      if(sha1Str !== signature){ //加密后的signature是否与微信发送过来的signature不一样。
        res.end('error')

      }

      // req.query里面有微信发送过来的{signature, echostr, timestamp, nonce}
      console.log(req.query)  //查看微信服务器自动回复的消息,可以看到用户的ID

      //接收请求体中的流式数据
      const xmlData = await getUserDataAsync(req) //await关键字能将getUserDataAsync函数的返回值赋给xmlData
      console.log(xmlData)  //  xmlData为一个xml数据
      /*  xmlData结果
          <xml>
            <ToUserName><![CDATA[gh_192eb0d1ccb5]]></ToUserName>   //开发者ID
            <FromUserName><![CDATA[oYKkZwTD54mVsKXsw6a1QUuWvBKk]]></FromUserName> //用户ID
            <CreateTime>1587048470</CreateTime> //发送消息的时间戳
            <MsgType><![CDATA[text]]></MsgType>  //消息类型
            <Content><![CDATA[发发发发发顺丰]]></Content>  //消息内容
            <MsgId>22721071290062521</MsgId> //消息ID，默认保存3天，3天内可以通过此ID找到对应的消息
          </xml>
      */

      //将xml数据转换为js对象
      const jsData = await parseXMLasync(xmlData)
      console.log(jsData)
      /*  jsData结果
           { xml:
               { ToUserName: [ 'gh_192eb0d1ccb5' ],
                 FromUserName: [ 'oYKkZwTD54mVsKXsw6a1QUuWvBKk' ],
                 CreateTime: [ '1587345064' ],
                 MsgType: [ 'text' ],
                 Content: [ '发顺丰' ],
                 MsgId: [ '22725316692025030' ]
               }
            }
      */

      //格式化数据
      const message = formatMessage(jsData)
      console.log(message);
      /* message结果
         {  ToUserName: 'gh_192eb0d1ccb5',
            FromUserName: 'oYKkZwTD54mVsKXsw6a1QUuWvBKk',
            CreateTime: '1587350306',
            MsgType: 'text',
            Content: '发顺丰',
            MsgId: '22725391778316735'
          }
       */




      //返回的消息，回复消息时把FromUserName和ToUserName的位置换一下就可以了，把注意：尖括号内不能有空格
      //  ${content}, 里面的content为自定义的修改内容
      /*let replyMessage = `<xml>
          <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
          <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
          <CreateTime>${Date.now()}</CreateTime>
          <MsgType><![CDATA[${message.MsgType}]]></MsgType>
          <Content><![CDATA[${content}]]></Content>
          <MsgId>${message.MsgId}</MsgId>     
        </xml>`*/
      let options = reply(message)

      let replyMessage = template(options)

        //返回消息给用户,即自动回复
      res.send(replyMessage)

      //若开发服务器未发送响应给微信服务器，它会发送三次消息给开发服务器。
      // 解决：发送一个空的请求给微信服务器
      // res.end('') // 开发服务器收到微信服务器的消息后，立马发送一个空的返回消息，结束请求。


    }else {
      res.end('error')

    }




  }




}

