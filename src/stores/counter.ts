import { authentication, getUserBycode } from '@/axios/interfaceLogin'
import * as dd from 'dingtalk-jsapi'
import { defineStore } from 'pinia'

interface userInfoOPT {
  depart: string
  depid: string
  position: string
  userid: string
  username: string
  rank: number
}
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const mesg = ref('')
  const userInfo = ref<userInfoOPT>({
    depart: '',
    depid: '',
    position: '',
    userid: '',
    username: '',
    rank: 0,
  })
  const permissions = ref<number>(0)
  
  function login() {
    const authData = {
      timestamp: Math.trunc(new Date().getTime() / 1000),
      url: window.location.href,
    }
    authentication(authData).then(({ data: res }) => {
      dd.config({
        agentId: '1489417393', // 必填，微应用ID
        corpId: res.corpId, // 必填，企业ID
        timeStamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonce_str, // 必填，自定义固定字符串。
        signature: res.msg, // 必填，签名
        // type: 0 / 1, // 选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
        jsApiList: [
          'writeNFC',
          'chooseImage',
          'getLocation',
          'editPicture',
          'biz.contact.choose',
          'device.notification.confirm',
          'device.notification.alert',
          'device.notification.prompt',
          'biz.ding.post',
          'biz.util.openLink',
        ], // 必填，需要使用的jsapi列表，注意：不要带dd。
      })
    })
    return new Promise((reslove, reject) => {
      dd.ready(() => {
        dd.util.domainStorage.getItem({
          name: 'spotCheck_userMsg', // 存储信息的key值
          onSuccess(info: { value: string }) {
            if (info.value === '') {
              dd.runtime.permission.requestAuthCode({
                corpId: 'ding740dacb926a2a89635c2f4657eb6378f', // 企业id
                onSuccess(info: any) {
                  // code = info.code // 通过该免登授权码可以获取用户身份
                  getUserBycode(info.code).then(({ data: res }) => {
                    dd.util.domainStorage.setItem({
                      name: 'xc_schedule_userMsg', // 存储信息的key值
                      value: JSON.stringify(res.result), // 存储信息的Value值
                      onSuccess() {
                        userInfo.value = res.result
                        reslove(
                          {
                            result: true,
                            mesg: '用户信息来自服务器',
                          },
                        )
                      },
                      onFail(err: any) {
                        reject(err)
                        // eslint-disable-next-line no-alert
                        alert(`写入用户名信息失败,失败原因：${err}`)
                      },
                    })
                  })
                },
              })
            }
            else {
              userInfo.value = JSON.parse(info.value)
              reslove({
                result: true,
                mesg: '用户信息来自本地',
              })
            }
          },
          onFail(err: any) {
            mesg.value = `没有储存的数据${err}`
            reject(err)
          },
        })
      })
    })
  }
  return { token, userInfo, login, permissions }
})
