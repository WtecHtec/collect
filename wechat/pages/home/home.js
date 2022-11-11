
import { getGroups, getCountNotice, getCountGroupNum, getOwnNotices } from '../servers/home'
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
          this.setData({ pageStatus: PAGE_STATUS.normal, groups: res.data })
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
    const notices = await this._getOwnNotices()
    if (notices.length) {
      const countNotices = await this._getCountNotice();
      if (countNotices.length) {

      }
      const groups = await this._getCountGroupNum()
    }
    
      // if (groups.length === 0) return
      // const gMap  = {}
      // groups.forEach(g => {
      //   gMap[g.group_id] = g
      // })
      // const nDatas = res.data.filter(item => gMap[item.group_id])
      // if (nDatas.length === 0) return
      // nDatas.forEach(item => {
      //   const gInfo = gMap[item.group_id]
      //   item.group_total = Number(gInfo.group_total) || 0
      //   const clNum = Number(item.collect_total) || 0
      //   if (item.group_total === 0 || clNum === 0) {
      //     item.percent = 0
      //     return
      //   }
      //   item.percent = clNum / item.group_total * 100
      //   item.pColor = this.formatPerColor(item.percent)
      //   item.un_total = Math.abs(item.group_total - clNum)
      //   item.createTime = dayjs(item.create_time).format('YYYY-MM-DD')
      // })
      // this.setData({ noticeCounts: nDatas, loadNotice: false });
  },
  async _getCountNotice() {
    const [err, res] = await getCountNotice()
    if (!err && res && res.code === 200 && Array.isArray(res.data) && res.data.length) {
      return res.data
    } 
    return []
  },
  async _getCountGroupNum() {
    const [err, res] = await getCountGroupNum()
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
  async _getOwnNotices() {
    const [err, res] = await getOwnNotices()
    if (!err && res && res.code === 200 && Array.isArray(res.data) && res.data.length) {
      return res.data
    }
    return []
  }
})