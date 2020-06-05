/*
   回复用户消息的模板， 在微信文档，"消息管理"------"被动回复用户消息"里面找资料
*/

module.exports = options => {
  let replyMessage = `<xml>
          <ToUserName><![CDATA[${options.ToUserName}]]></ToUserName>  
          <FromUserName><![CDATA[${options.FromUserName}]]></FromUserName>
          <CreateTime>${options.createTime}</CreateTime>
          <MsgType><![CDATA[${options.MsgType}]]></MsgType>
          <MsgId>${options.MsgId}</MsgId>`

  if (options.MsgType === 'text') {
    replyMessage += `<Content><![CDATA[${options.content}]]></Content>`

  } else if (options.MsgType === 'image') {
    replyMessage += `<PicUrl><![CDATA[this is a url]]></PicUrl>
                    <MediaId><![CDATA[${options.mediaId}]]></MediaId>`

  } else if (options.MsgType === 'voice') {
    replyMessage += `<Voice> <MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`

  } else if (options.MsgType === 'video') {
    replyMessage += `<Video>
                      <MediaId><![CDATA[${options.mediaId}]]></MediaId>
                      <Title><![CDATA[${options.title}]]></Title>
                      <Description><![CDATA[${options.description}]]></Description>
                    </Video>`

  } else if (options.MsgType === 'music') {
    replyMessage += `<Music>
                      <Title><![CDATA[${options.title}]]></Title>
                      <Description><![CDATA[${options.description}]]></Description>
                      <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
                      <HQMusicUrl><![CDATA[${options.HQMusicUrl}]]></HQMusicUrl>
                      <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
                    </Music>`

  } else if (options.MsgType === 'news') {
    replyMessage += `<ArticleCount>${options.content.length}</ArticleCount>
                            <Articles>`;
    options.content.forEach(item => {
      replyMessage += `<item>
                          <Title><![CDATA[${item.title}]]></Title>
                          <Description><![CDATA[${item.description}]]></Description>
                          <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
                          <Url><![CDATA[${item.url}]]></Url>
                      </item>`

    })
    replyMessage += `</Articles>`
  } else if (options.MsgType === 'location') {
    replyMessage = options.content
  } else if (options.MsgType === 'event') {
    replyMessage = options.content
  }


  replyMessage += ` </xml>`

  return replyMessage
}

