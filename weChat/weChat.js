const {appID, appsecret}= require('./config/config.js')
const requestWechat = require('request-promise-native')
const {writeFile, readFile} = require('fs')
const rp = require('rp')  //rp库，用于发送请求
const menu = require('./menu.js')


class Wechat {
  constructor () {

  }

  //获取accessToken
  getAccessToken () {

    //注意：此处为字符串拼接
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`

    return new Promise ((resolve, reject) => {
      requestWechat({method: 'get', url, json: true})
        .then(res => {  //请求成功
          console.log(res);

          //设置accessToken的过期时间，在过期前5分钟再次申请
          res.expires_in = Date.now() +  (res.expires_in*1000) - (5*60*1000) //都是毫秒数

        // 把res数据传出去，将promise对象改为成功的状态
          resolve(res)

        })
        .catch(err => {  //请求失败
          console.log(err);
          reject('getAccessToken failed') //将失败信息传出去
        })

    })


  }

  //保存accessToken
  saveAccessToken (accessToken) {
    accessToken = JSON.stringify(accessToken) //写入文件里面的内容必须是json对象
    return new Promise ((resolve, reject) => {
      writeFile('./accessToken.txt', accessToken, err => {
        if(!err) { //文件写入成功
          console.log('saved accessToken success');
          resolve(accessToken)  //成功时执行

        }else { //文件写入失败
          reject('saved  accessToken failed' + err)    //失败时执行
        }

      })
    })

  }

  //读取acessToken
  readAccessToken () {
    return new Promise ((resolve, reject) => {
     readFile('./accessToken.txt', (err, data) => {
        if(!err) {  //读取文件成功
          data = JSON.parse(data)  //将json字符串转换为js对象
          console.log('read accessToken success');
          resolve(data)  //存储读取的数据

        }else {  //读取文件失败
          reject('saved  accessToken failed' + err)   
        }

      })
    })

  }

  //检测数据的有效性
  isValidAccessToken (data) {
    if(!data && !data.accessToken && !data.expires_in) {  //若accessToken无效
      return false;

    }

    //若数据有效，再检测数据是否过期（若不过期，"设置的过期时间"必须要将"当前时间"包括在内部,即比当前时间要大）
    if (data.expires_in < Date.now()) {  //若过期了
      return false

    }else {   //没有过期了
      return true
    }

    // data.expires_in < Date.now() //简写形式

  }

  //获取没有过期的accesssToken
  fetchAccessToken () {
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in
      })
    }
    // return new Promise ((resolve, reject) => {
    return this.readAccessToken() //this指向新建的实例对象w
        .then(async res => {   //若本地有文件     //?????????????????
          if(this.isValidAccessToken(res)){   //文件是否过期，未过期则进行保存
            return Promise.resolve(res)   //???????????
            // resolve(res)
            console.log('accessToken存在且有效')
          }else{  //文件过期了，重新获取一次accesssToken
            const res = await this.getAccessToken();   //?????????????????
            await this.saveAccessToken(res)  //获取成功，则保存口令
            return Promise.resolve(res)   //???????????
            // resolve(res)  //将res里面的数据暴露出去

              /*.then(res => {  //获取accessToken成功，则进行保存
                this.saveAccessToken(res)
                  .then(() => {
                    console.log('token过期了，重新获取到了且保存成功')
                    resolve(res)  //将res里面的数据暴露出去
                  })
              })
              .catch(err => {
                console.log('token过期了，重新获取失败' + err)

              })*/

          }

        })
        .catch (async err => { //若本地无文件
          const res = await this.getAccessToken();   //?????????????????
          await this.saveAccessToken(res)  //获取成功，则保存口令
          return Promise.resolve(res)   //???????????
          // resolve(res)  //将res里面的数据暴露出去

          /*this.getAccessToken()
            .then(res => {  //获取accessToken成功，则进行保存
              this.saveAccessToken(res)
                .then(() => {
                  resolve(res)  //将res里面的数据暴露出去
                  console.log('创建了新的token文件，且保存成功')
                })
            })
            .catch(err => {
              console.log('本地无token文件，且获取失败')

            })
*/

        })
        .then(res => {
          this.access_token = res.access_token   //this指向新建对象w  ？？？？？？？？？？？？？？？？
          this.expires_in = res.expires_in   //this指向新建对象w  ？？？？？？？？？？？？？？？？
          return Promise.resolve(res)
        })
    // })
  }

  //创建自定义菜单
  createMemu (menu) {
    return new Promise (async (resolve, reject) => {
     try {
       const data = await this.fetchAccessToken() //获取口令对象，await会将fetchAccessToken执行的结果赋值给data
       const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`

       const result = await rp({method: 'POST', url, json: true, body: menu})  //发送请求，创建自定义菜单
       resolve(result)
     } catch (err) {
       reject('createMemu方法出错' + err)
     }
    })
  }

  //删除自定义菜单
  deleteMemu () {   //不用传入任何参数
    return new Promise (async (resolve, reject) => {
      try {
        const data = await this.fetchAccessToken() //获取口令对象，await会将fetchAccessToken执行的结果赋值给data
        const url = ` https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`

        const result = await rp({method: 'GET', url, json: true})  //发送请求，创建自定义菜单
        resolve(result)
      } catch (err) {
        reject('deleteMemu方法出错' + err)
      }
    })
  }


}



const w = new Wechat()
// w.getAccessToken()

w.fetchAccessToken().then(res => {
  console.log(res);
})



