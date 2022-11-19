import {postCheckLogin, getLoginCode, postLogin, getUserInfo, postUserInfo, NavToPage } from '../servers/login'
import { setStorage } from '../../utils/util';
import { USERINFO_KEY, MINIKET_KEY } from '../../utils/storage-keys'
import { PAGE_STATUS, RE_OPT } from '../../utils/config'
const app = getApp()
Page({
  data: {
    pageStatus: PAGE_STATUS.loading,
    from: 'init',
    noticeId: '',
  },
	onLoad(options) {
    options.from && (this.data.from = options.from);
    options.noticeId && (this.data.noticeId = options.noticeId)
    this.optNums = 0
		this.checkLoin()
  },
	async checkLoin() {
		this.setData({ pageStatus: PAGE_STATUS.loading })
		const [err, res] = await postCheckLogin();
		if (!err && res) {
      if (res.code === 200) {
        this._postUserInfo();
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
      this._postUserInfo();
		}
	},
	bindRight() {
		this.optNums += 1 
		this.checkLoin()
  },
  async _postUserInfo() {
    const { from, noticeId } = this.data;
    const [err, res] = await postUserInfo();
    if (!err && res && res.code === 200 && res.data) {
      const { PhoneNumer } = res.data || {}
      this.setData({ pageStatus: PAGE_STATUS.normal })
      if ( PhoneNumer ) {
        setStorage(USERINFO_KEY, res.data)
        app.globalData.userInfo = res.data
        NavToPage(from, noticeId)
      } else {
        // 注册页
        wx.redirectTo({ url: `/pages/registe/index?from=${from}&noticeId=${noticeId}` });
      }
    } else {
      // 进入兜底
      this.setData({ pageStatus: PAGE_STATUS.error })
    }
  },
  bindReJoin() {
    // 清除缓存
    setStorage(USERINFO_KEY, null)
    setStorage(MINIKET_KEY, null)
    wx.redirectTo({ url: `/pages/index/index` });
  }
})
