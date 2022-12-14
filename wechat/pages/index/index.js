import {postCheckLogin, getLoginCode, postLogin, getUserInfo} from '../servers/login'
import { setStorage, getStorage } from '../../utils/util';
import { USERINFO_KEY, MINIKET_KEY } from '../../utils/storage-keys'
import { PAGE_STATUS, RE_OPT } from '../../utils/config'
const app = getApp()
Page({
  data: {
    pageStatus: PAGE_STATUS.loading,
    from: 'init',
  },
	onLoad() {
    this.optNums = 0
		this.checkLoin()
  },
	async checkLoin() {
		this.setData({ pageStatus: PAGE_STATUS.loading })
		const [err, res] = await postCheckLogin();
		if (!err && res) {
      if (res.code === 200) {
        this.setData({ pageStatus: PAGE_STATUS.normal })
        app.globalData.userInfo = getStorage(USERINFO_KEY)
        this.NavToPage()
        return
      }
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
				this.setData({ pageStatus: this.optNums >= RE_OPT ? PAGE_STATUS.reopt : PAGE_STATUS.noright })
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
      this.NavToPage()
		}
	},
	bindRight() {
		this.optNums += 1 
		this.checkLoin()
  },
  NavToPage() {
    const { from } = this.data;
    if (from === 'init') {
      wx.redirectTo({ url: '/pages/home/home' });
    }
  }
})
