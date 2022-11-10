
import { getGroups } from '../servers/home'
import { PAGE_STATUS } from '../../utils/config.js';
const dayjs = require('../../utils/day.min.js');
const app = getApp();
Page({
  data: {
    pageStatus: PAGE_STATUS.loading,
    userInfo: {},
    profile_icture_src: "/static/img/test/img_logo.jpg",
    name: "BeanC",
    tel: "13471422178",
    current: 0,
    groups: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userInfo =  app.globalData.userInfo || {};
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
          return 
        }
        this.setData({ pageStatus: PAGE_STATUS.empty })
      } else {
        this.setData({ pageStatus: PAGE_STATUS.error })
      }
    } else {
      this.setData({ pageStatus: PAGE_STATUS.nonetwork })
    }
  }
})