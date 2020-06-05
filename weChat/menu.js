/*
* 自定义菜单
*
* */

module.exports = {
  "button":[
    {
      "type":"click",
      "name":"主菜单1",
      "key":"V1001_TODAY_MUSIC"
    },
    {
      "name":"子菜单",
      "sub_button":[
        {
          "type":"view",
          "name":"跳转链接",
          "url":"http://www.soso.com/"
        },
        {
          "type":"miniprogram",
          "name":"wxa",
          "url":"http://mp.weixin.qq.com",
          "appid":"wx286b93c14bbf93aa",
          "pagepath":"pages/lunar/index"
        },
        {
          "type":"click",
          "name":"赞一下我们",
          "key":"V1001_GOOD"
        },
        {
          "name": "扫码",
          "sub_button": [
            {
              "type": "scancode_waitmsg",
              "name": "扫码带提示",
              "key": "rselfmenu_0_0",
              "sub_button": [ ]
            },
            {
              "type": "scancode_push",
              "name": "扫码推事件",
              "key": "rselfmenu_0_1",
              "sub_button": [ ]
            }
          ]
        },
        {
          "name": "发图",
          "sub_button": [
            {
              "type": "pic_sysphoto",
              "name": "系统拍照发图",  //调用相机拍照
              "key": "rselfmenu_1_0",
              "sub_button": [ ]
            },
            {
              "type": "pic_photo_or_album",
              "name": "拍照或者相册发图", //调用相机拍照或者调用相册
              "key": "rselfmenu_1_1",
              "sub_button": [ ]
            },
            {
              "type": "pic_weixin",
              "name": "微信相册发图",  //调用相册
              "key": "rselfmenu_1_2",
              "sub_button": [ ]
            }
          ]
        },
        {
          "name": "发送位置",
          "type": "location_select",
          "key": "rselfmenu_2_0"
        },
        /*{
          "type": "media_id",
          "name": "点击发送图片",
          "media_id": "MEDIA_ID1"
        },
        {
          "type": "view_limited",
          "name": "点击发送图文消息",
          "media_id": "MEDIA_ID2"
        }*/

      ]
    }]
}