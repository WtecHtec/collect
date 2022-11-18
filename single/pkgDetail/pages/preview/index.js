import { PAGE_STATUS } from "../../../utils/config";
import { getNoticeRaleOwnsg } from "../../server/dataserver"
import { BASE_URL, mode } from "../../../config";
const dayjs = require('../../../utils/day.min.js');
const IMG_FIX_URL = BASE_URL[mode];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageStatus: PAGE_STATUS.loading,
    collectId: '',
    previewData: {
      label: '通知详情',
      list: [{
        label: '标题',
        key: 'notice_title',
        value: '',
      }, {
        label: '结束时间',
        key: 'end_time',
        value: '',
      }, {
        label: '创建时间',
        key: 'update_time',
        value: ''
      }, {
        label: '内容',
        key: 'notice_desc',
        value: ''
      }],
    },
    previewDataUp: {
      label: '上传详情',
      list: [{
        label: '备注',
        key: 'collect_desc',
        value: '',
      }],
    },
    imgUrls: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!options.collectId) {
      this.setData({ pageStatus: PAGE_STATUS.empty })
      return
    }
    this.data.collectId = options.collectId
    this._getNoticeRaleOwnsg()
  },
  async _getNoticeRaleOwnsg() {
    let { collectId, previewData, previewDataUp, imgUrls } = this.data
    const [err, res] = await getNoticeRaleOwnsg(collectId, '-1');
    let pageStatus = PAGE_STATUS.empty
    if (!err && res && res.code === 200 && Array.isArray(res.data) && res.data.length === 1) {
      pageStatus = PAGE_STATUS.normal
      const info =  res.data[0]
      const tims = ['end_time',  'update_time']
      previewData.list.forEach(item => {
        if (info[item.key]) {
          item.value = tims.includes(item.key) ? dayjs(info[item.key]).format('YYYY-MM-DD HH:mm:ss') : info[item.key]
        }
      })
      previewDataUp.list.forEach(item => {
        info[item.key] && (item.value = info[item.key])
      })
      if (info.img_urls) {
        imgUrls =  info.img_urls.split(';').map(item => `${IMG_FIX_URL}${item}`)
      }
    }
    this.setData({
      imgUrls,
      pageStatus,
      previewDataUp,
      previewData,
    })
  },
  previewImage(e) {
    const { imgUrls } = this.data;
    const { index } = e.currentTarget.dataset
    wx.previewImage({
      current: imgUrls[index], // 当前显示图片的 http 链接
      urls: [...imgUrls] // 需要预览的图片 http 链接列表
    })
  }
})