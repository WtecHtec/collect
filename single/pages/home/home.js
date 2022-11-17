
import { getCountNotice, } from '../servers/home'
import { PAGE_STATUS } from '../../utils/config.js';
import { FEEBBACK_KEY } from '../../utils/storage-keys'
import { getStorage, setStorage } from '../../utils/util'
import { watch } from '../../utils/event_bus';
const dayjs = require('../../utils/day.min.js');
const app = getApp();
let startY = 0, startTime = 0;
const minOffset = 10
const minTime = 100
let changeStatus = true
let changeDiff = 0
Page({
  data: {
    pageStatus: PAGE_STATUS.loading,
    userInfo: {},
    groups: [],
    isMoreGroup: false,
    noticeCounts: [],
    loadNotice: true,
		moreNotice: false,
    mt: 24,
    hasNews: false,
    loadGroup: true,
    showFb: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userInfo = app.globalData.userInfo || {};
    this.setData({
      userInfo,
    })
    this._setCountNotice()
    this.changeFeebBack()
    watch('opt_collect', () => {
      this._setCountNotice()
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.hideHomeButton()
  },
  async _setCountNotice() {
		const countNotices = await this._getCountNotice();
    let mt = 0
		if (countNotices.length) {
			countNotices.forEach((item, index) => {
        mt += 24
        item.pos = index
				item.createTime = dayjs(item.end_time).format('YYYY-MM-DD')
        item.group_total = Number(item.target_num) || 0
        item.collect_total = Number(item.notice_total) || 0
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
			moreNotice: countNotices.length > 3,
      pageStatus: countNotices.length ? PAGE_STATUS.normal : PAGE_STATUS.empty,
		 }, () => {
      this._changeNoticeItem()
     });
  },
  async _getCountNotice() {
    const [err, res] = await getCountNotice()
    if (!err && res && res.code === 200 && Array.isArray(res.data) && res.data.length) {
      return res.data
    } 
    this.setData({
      pageStatus: PAGE_STATUS.error
    });
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
        }, 500)
      }
    } else {
      console.log('点击事件', event)
      this.bindToNotice()
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
  navFeebBack() {
    wx.navigateTo({
      url: '/pkgDetail/pages/feebback/index',})
  },
  changeFeebBack() {
    const cacheInfo = getStorage(FEEBBACK_KEY)
    let showFb = false
    if (!cacheInfo) {
      showFb = true
    } else {
      const nowTime = new Date().getTime()
      const nDiff = nowTime - cacheInfo.time
      if (nDiff > 24 * 60 * 60 * 1000) {
        showFb = true
        setStorage(FEEBBACK_KEY, null)
      } else {
        showFb = cacheInfo.num < 2
      }
    }
    this.setData({ showFb })
  },
  bindToNotice() {
    wx.navigateTo({ url: '/pkgDetail/pages/notice_info/index'})
  },
  bindToCollect() {
    wx.navigateTo({ url: '/pkgDetail/pages/notice_opt/index'})
  }
})