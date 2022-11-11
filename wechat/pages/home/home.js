
import { getGroups, getCountNotice } from '../servers/home'
import { PAGE_STATUS } from '../../utils/config.js';
const dayjs = require('../../utils/day.min.js');
const app = getApp();
Page({
  data: {
    pageStatus: PAGE_STATUS.loading,
    userInfo: {},
    groups: [],
    isMoreGroup: false,
    noticeCounts: [],
    loadNotice: true,
		moreNotice: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userInfo = app.globalData.userInfo || {};
    if (userInfo.CreateTime) {
      userInfo.registerTime = dayjs(userInfo.CreateTime).format('YYYY-MM-DD')
    }
    this.setData({
      userInfo,
    })
    this._getGroups()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.hideHomeButton()
  },

  async _getGroups() {
    const [err, res] = await getGroups()
    if (!err && res) {
      if (res.code === 200) {
        if (Array.isArray(res.data) && res.data.length) {
          res.data.forEach(item => {
            item.type = 'info'
          });
          this.setData({ 
						pageStatus: PAGE_STATUS.normal, 
						groups: res.data.slice(0, 3),
						isMoreGroup: res.data.length > 3,
					})
          this._setCountNotice()
          return 
        }
        this.setData({ pageStatus: PAGE_STATUS.empty })
      } else {
        this.setData({ pageStatus: PAGE_STATUS.error })
      }
    } else {
      this.setData({ pageStatus: PAGE_STATUS.nonetwork })
    }
  },
  async _setCountNotice() {
		const countNotices = await this._getCountNotice();
		if (countNotices.length) {
			countNotices.forEach(item => {
				item.createTime = dayjs(item.create_time).format('YYYY-MM-DD')
        item.group_total = Number(item.group_total) || 0
        item.collect_total = Number(item.collect_total) || 0
        if (item.group_total === 0 || item.collect_total === 0) {
					item.un_total = 0
          item.percent = 0
          return
        }
        item.percent = item.collect_total / item.group_total * 100
        item.pColor = this.formatPerColor(item.percent)
        item.un_total = Math.abs(item.group_total - item.collect_total)
      })
		}
    this.setData({ 
			noticeCounts: countNotices.slice(0, 1),
			loadNotice: false,
			moreNotice: countNotices.length > 1
		 });
  },
  async _getCountNotice() {
    const [err, res] = await getCountNotice()
    if (!err && res && res.code === 200 && Array.isArray(res.data) && res.data.length) {
      return res.data
    }
    return []
  },
  formatPerColor(value) {
    if (value < 50) return '#ff5845'
    else if (value < 100) return '#F57221'
    return '#12c194';
  },
})