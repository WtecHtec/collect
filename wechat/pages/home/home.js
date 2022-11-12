
import { getGroups, getCountNotice, getNewNotice } from '../servers/home'
import { PAGE_STATUS } from '../../utils/config.js';
const dayjs = require('../../utils/day.min.js');
const app = getApp();
let startY = 0, startTime = 0;
const minOffset = 10
const minTime = 100
let changeStatus = true
let changeDiff = 0
Page({
  data: {
    pageStatus: PAGE_STATUS.normal,
    userInfo: {},
    groups: [],
    isMoreGroup: false,
    noticeCounts: [],
    loadNotice: true,
		moreNotice: false,
    mt: 24,
    hasNews: false,
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
          this._getNewNotice()
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
    let mt = 24
		if (countNotices.length) {
			countNotices.forEach((item, index) => {
        mt += 24
        item.pos = index
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
      mt: countNotices.length >= 3 ? 72 : mt,
			noticeCounts: countNotices.slice(0, 3),
			loadNotice: false,
			moreNotice: countNotices.length > 3
		 }, () => {
      this._changeNoticeItem()
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
  catchTouchStart(event) {
    try {
      startY = event.touches[0].clientY; 
      startTime = new Date().getTime();//获取毫秒数
    } catch (error) {
      startY = 0
    }
  },
  catchTouchEnd(event) { 
    if (!changeStatus) return
    const endY = event.changedTouches[0].pageY;
    const touchTime = new Date().getTime() - startTime; //计算滑动时间
    //开始判断
    //1.判断时间是否符合
    if (touchTime >= minTime) {
      const yOffset = endY - startY;
      if (Math.abs(yOffset) >= minOffset) {
        //上下滑动
        changeDiff = yOffset < 0 ? 1 : -1 
        changeStatus = false
        this._changeNoticeItem()
        setTimeout(() => {
          changeStatus = true
        }, 1000)
      }
    } else {
      console.log('点击事件', event)
    }
  },
  _changeNoticeItem() {
    const { noticeCounts } = this.data;
    const len = noticeCounts.length
    const updataObj = {}
    noticeCounts.forEach((item, index) => {
      item.pos = item.pos + changeDiff
      if (changeDiff < 0) {
        item.pos = item.pos < 0 ? len - 1 : item.pos
      } else {
        item.pos = item.pos >= len ? 0 : item.pos
      }
      item.cls = `count-av-${item.pos}`
      updataObj[`noticeCounts[${index}].cls`] = item.cls
    })
    this.setData(updataObj)
  },
  async _getNewNotice() {
    const [err, res] = await getNewNotice()
    if (!err && res && res.code === 200) {
      this.setData({ hasNews: res.data })
    }
  }
})