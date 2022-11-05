import {postCheckLogin, getLoginCode, postLogin, getUserInfo} from '../servers/login'
import { setStorage, getStorage } from '../../utils/util';
import { USERINFO_KEY, MINIKET_KEY } from '../../utils/storage-keys'
const app = getApp()

Page({
  data: {
    show: true,
  },
	onLoad() {
    this.checkLoin()
  },
	async checkLoin() {
		const [err, res] = await postCheckLogin();
		if (!err && res && res.code === 401) {
      this.setData({ show: true });
      const [e, info]  = await getUserInfo();
      if (!e && info) {
        const code = await getLoginCode();
        console.log(info, code)
				if (!code) {
					// 进入兜底
					return
				}
			  await this.handLogin(code, info.avatarUrl,info.nickName);
      } else {
        // 拒绝授权，进入兜底页
        console.log('拒绝授权')
      }
		} else {
      console.log('网络异常')
    }
	},
	async handLogin(code, avatarUrl, nickName) {
		const [err, res] = await postLogin(code, avatarUrl, nickName);
		if (!err && res && res.code === 200) {
			setStorage(MINIKET_KEY, res.minikey)
      setStorage(USERINFO_KEY, res.info)
		}
	},
  onClose() {
    this.setData({ show: false })
  },
  getPhoneNumber (e) {
    console.log(e.detail.code)
  }

})
