import { PAGE_STATUS } from "../../../utils/config";
import { getNoticeInfossg, getMsgCollectsg } from "../../server/dataserver";
import { BASE_URL, mode } from "../../../config";
import { watch } from '../../../utils/event_bus';
const dayjs = require('../../../utils/day.min.js');
const app = getApp();
const IMG_FIX_URL = BASE_URL[mode];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageStatus: PAGE_STATUS.loading,
    noticeInfo: {},
    noticeId: null,
    fabs: [{
      abbr: 'E',
      abbrSize: 48,
      text: '修改'
    }, {
      openType: 'share',
      btnFor: 'share-btn',
      abbr: 'S',
      abbrSize: 48,
      text: '转发'
    }],
    loadMsg: true,
    total: 0,
    allImgs: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!options.noticeId) { 
      this.setData({
        pageStatus: PAGE_STATUS.empty,
      })
      return;
    }
    this.data.noticeId = options.noticeId
    this._getNoticeInfossg();
    this._getMsgCollectsg()
    watch('ino_opt_collect', () => {
      this._getNoticeInfossg();
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    app.globalData.homeNoticeInfo && (app.globalData.homeNoticeInfo = null)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const { noticeId } = this.data;
    let Name = ''
    try {
       Name = app.globalData.userInfo.Name
    } catch(er) {

    }
    console.log(`/pages/index/index?from=collect&noticeId=${noticeId}`)
    return {
      title: `${Name}邀请您参加收集活动`,
      path: `/pages/index/index?from=collect&noticeId=${noticeId}`,
    }
  },
  async _getNoticeInfossg() {
    const { noticeId } = this.data;
    const param = {
      order: '-1',
      enable: '-1',
      notice_id: noticeId,
    }
    const [err, res] = await getNoticeInfossg(param)
    if (!err && res && res.code === 200 && Array.isArray(res.data) && res.data.length) {
        const info = res.data[0]
        const noticeInfo = {
          title: info.notice_title,
          desc: info.notice_desc,
          source: '结束时间',
          time: dayjs(info.end_time).format('YYYY-MM-DD HH:mm:ss'),
          extra: `目标:${info.target_num}人`,
          ...info,
        }
        this.setData({
          noticeInfo,
          pageStatus: PAGE_STATUS.normal,
        })
    } else {
      this.setData({
        pageStatus: PAGE_STATUS.empty,
      })
    }
  },
  handleClick(e) {
   const { index } = e.detail
   const { noticeId } = this.data;
   if (index === 0) {
    // 修改
    wx.navigateTo({ url: `/pkgDetail/pages/notice_opt/index?optType=update&noticeId=${noticeId}`})
   }
  },
  async _getMsgCollectsg() {
    const { noticeId } = this.data;
    const [err, res] = await getMsgCollectsg(noticeId)
    const allImgs = []
    let msgCollects = []
    if (!err && res && res.code === 200 && Array.isArray(res.data)) {
      msgCollects = res.data
      msgCollects.forEach(item => {
        const imgs =  item.img_urls.split(';')
        item.imgNum = imgs.length
        item.imgIndex = allImgs.length
        imgs.forEach(im => {
          // allImgs.push(`${IMG_FIX_URL}${item}`)
					allImgs.push({
						picUrl: `${IMG_FIX_URL}${im}`,
						desc: item.collect_desc || ''
					})
        })
      })
    }
    this.data.allImgs = allImgs;
    this.setData({
      msgCollects,
      loadMsg: false,
    })
  },
  bindGrid(e) {
    const { index } = e.detail
    const { msgCollects, allImgs } = this.data;
    const c = msgCollects[index];
    if (c)  {
      // wx.previewImage({
      //   current: allImgs[c.imgIndex], // 当前显示图片的 http 链接
      //   urls: [...allImgs] // 需要预览的图片 http 链接列表
      // })
			app.globalData.previewInfo =  {
				list: [
				...allImgs
				],
				current: c.imgIndex,
			}
			wx.navigateTo({ url: '/pages/preview/index'})
    }
  }

})