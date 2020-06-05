/*
    处理用户发送的消息和内容，决定返回不同的内容个用户,  在微信文档，"消息管理"------"接收普通消息"里面找资料
 */

moudle.exports = (message) => {
  let options = {
    'ToUserName': message.FromUserName,
    'FromUserName': message.ToUserName,
    'createTime': Date.now(),
    'MsgType': 'text',
    'MsgId': '22725391778316735',


  }

  let content = '无法处理消息'
  if (message.MsgType === 'text') {
    if (message.Content === '1') { //全匹配
      content = '111111'

    } else if (message.Content === '2') {
      content = '22222222'

    } else if (message.Content.match('回复')) { //半匹配
      content = '我来回复你吧'

    }

  } else if (message.MsgType === 'image') {
    options.MsgType = 'image'
    options.mediaId = message.MediaId
    console.log(message.PicUrl);
  } else if (message.MsgType === 'voice') {
    options.MsgType = 'voice'
    options.mediaId = message.MediaId
    console.log(message.PicUrl);

  } else if (message.MsgType === 'location') {
    options.MsgType = 'location'
    content = `经度：${message.Location_X} 纬度：${message.Location_Y} 缩放：${message.Scale} 地理位置：${message.Label}`

  } else if (message.MsgType === 'event') {
    options.MsgType = 'event'
    if (message.Event === 'subscribe') {
      content = '欢迎您关注本公众号！'
    } else if (message.Event === 'unsubscribe') {
      content = '您已经取消关注，欢迎下次关注！'
    }
  } else if (message.event === 'SCAN') {
    content = '用户已经关注了，扫描带参数二维码事件'
  } else if (message.event === 'LOACATION') {
    //用户每次进入公众号回话时，都会上报地理位置，要使用此功能，需要点击将此功能开启
    content = `纬度：${message.Latitude} 经度：${message.Longitude} 精度：${message.Precision}`
  } else if (message.event === 'CLICK') {  //自定义菜单事件
    content = `您点击了按钮：${message.EventKey}`
  }



  options.content = content  //给options追加一个属性content
  console.log('ooooooooooooooooo: ' + options);

   return options


}