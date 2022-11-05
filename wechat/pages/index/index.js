import {postCheckLogin, getLoginCode, postLogin, getUserInfo} from '../servers/login'
import { setStorage, getStorage } from '../../utils/util';
import { USERINFO_KEY, MINIKET_KEY } from '../../utils/storage-keys'
import { PAGE_STATUS } from '../../utils/config'
const app = getApp()
Page({
  data: {
    pageStatus: PAGE_STATUS.loading,
  },
	onLoad() {
    this.checkLoin()
  },
	async checkLoin() {
		this.setData({ pageStatus: PAGE_STATUS.loading })
		const [err, res] = await postCheckLogin();
		if (!err && res && res.code === 401) {
      const [e, info]  = await getUserInfo();
      if (!e && info) {
        const code = await getLoginCode();
				if (!code) {
					// 进入兜底
					this.setData({ pageStatus: PAGE_STATUS.error })
					return
				}
			  await this.handLogin(code, info.avatarUrl,info.nickName);
      } else {
        // 拒绝授权，进入兜底页
				this.setData({ pageStatus: PAGE_STATUS.noright })
      }
		} else {
			this.setData({ pageStatus: PAGE_STATUS.nonetwork })
    }
	},
	async handLogin(code, avatarUrl, nickName) {
		const [err, res] = await postLogin(code, avatarUrl, nickName);
		if (!err && res && res.code === 200) {
			setStorage(MINIKET_KEY, res.minikey)
      setStorage(USERINFO_KEY, res.info)
			app.globalData.userInfo = res.info;
		}
	},
  onClose() {
    this.setData({ show: false })
  },
  getPhoneNumber (e) {
    console.log(e.detail.code)
  },
	bindRight() {
		this.checkLoin()
	}
})
