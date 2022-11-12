import {postCheckLogin, getLoginCode, postLogin, getUserInfo} from '../servers/login'
import { setStorage, getStorage } from '../../utils/util';
import { USERINFO_KEY, MINIKET_KEY } from '../../utils/storage-keys'
import { PAGE_STATUS, RE_OPT } from '../../utils/config'
const app = getApp()
Page({
  data: {
    pageStatus: PAGE_STATUS.loading,
    from: 'init',
		acI: 0,
		lastac: 0,
		items : [
			 {
			pos: 0,
			bgcolor: 'green',
			anmcls: 'a0'
		},
		{
			pos: 1,
			bgcolor: 'red',
			anmcls: 'a1'
		},
		{
			pos: 2,
			bgcolor: 'blue',
			anmcls: 'a2'
		},
	]
  },
	onLoad() {
    this.optNums = 0
		this.checkLoin()
  },
	bindDown({currentTarget}) {
		const { item, index } = currentTarget.dataset
		const { pos } = item
		const { items } = this.data
		const updataobj = {}
		items.forEach( (i, idx) => {
			let pos = i.pos - 1 
			pos = pos < 0  ? items.length - 1 :  pos
			updataobj[`items[${idx}].anmcls`] = `a${pos}`
			i.pos = pos
		})
    this.setData(updataobj)
		// console.log(item, updataobj, this.data.items)
	},
	bindUp({currentTarget}) {
		const { item, index } = currentTarget.dataset
		const { pos } = item
		const { items } = this.data
		const updataobj = {}
		items.forEach( (i, idx) => {
			let pos = i.pos + 1 
			pos = pos > items.length - 1  ? 0:  pos
			updataobj[`items[${idx}].anmcls`] = `a${pos}`
			i.pos = pos
		})
    this.setData(updataobj)
		// console.log(item, updataobj, this.data.items)
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
