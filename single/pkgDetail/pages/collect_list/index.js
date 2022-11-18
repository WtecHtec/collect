import { getNoticeInfossg,getNoticeRaleOwnsg } from "../../server/dataserver";
import { PAGE_STATUS } from "../../../utils/config";
const dayjs = require('../../../utils/day.min.js');
const DATA_KEY = {
  notice: 1,
  msgcollect: 0,
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['我的上传', '我的收集'],
    current: 0,
    pageStatus: PAGE_STATUS.loading,
    dataLists: [],
    panelDatas: { list: []},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { current } = this.data;
    if (options.tabIndex && !isNaN(Number(options.tabIndex))) {
      current = Number(options.tabIndex)
    }
    this.setData({
      current,
    }, () => {
      this.loadData()
    })
  },
  loadData() {
    const { current } = this.data;
    current === 0 ? this._getMsgCollect() : this._getNoticeInfossg()
  },
  async _getMsgCollect() {
    let msgCollects = []
    const [err, res] = await getNoticeRaleOwnsg()
    if (!err && res && res.code === 200 && Array.isArray(res.data)) {
      msgCollects = res.data
    }
    msgCollects = this._formatMsg(msgCollects)
    this.data.dataLists[DATA_KEY.msgcollect] = msgCollects;
    this.setData({
      [`panelDatas.list`]: msgCollects,
      pageStatus: msgCollects.length ? PAGE_STATUS.normal : PAGE_STATUS.empty
    })
  },
  _formatMsg(data) {
    return data.map(item => {
      const noticeInfo = {
        title: item.notice_title,
        desc: item.notice_desc,
        source: '状态',
        time: `${item.enable === '1' ? '正在进行中' : '已过期'}`,
        ...item,
      }
      return noticeInfo;
    })
  },
  async _getNoticeInfossg() {
    const param = {
      enable: '-1',
      notice_id: '-1',
    }
    const [err, res] = await getNoticeInfossg(param)
    let noticeList = [];
    if (!err && res && res.code === 200 && Array.isArray(res.data)) {
      noticeList = res.data
    }
    noticeList = this._formatNotice(noticeList)
    this.data.dataLists[DATA_KEY.notice] = noticeList;
    this.setData({
      [`panelDatas.list`]: noticeList,
      pageStatus: noticeList.length ? PAGE_STATUS.normal : PAGE_STATUS.empty
    })
  },
  _formatNotice(noticeList) {
    return noticeList.map(item => {
      const noticeInfo = {
        title: item.notice_title,
        desc: item.notice_desc,
        source: '结束时间',
        time: dayjs(item.end_time).format('YYYY-MM-DD HH:mm:ss'),
        extra: `目标:${item.target_num}人`,
        ...item,
      }
      return noticeInfo;
    })
  },
  bindClick(event) {
    const { current } = this.data
    const { notice_id, enable, collect_id } = event.detail
    if (current === 1) {
      notice_id && wx.navigateTo({ url: `/pkgDetail/pages/notice_info/index?noticeId=${notice_id}`})
    } else {
      if (enable === '1') {
        wx.navigateTo({ url: `/pkgDetail/pages/msg_collect/index?noticeId=${notice_id}`})
      } else {
        wx.navigateTo({ url: `/pkgDetail/pages/preview/index?collectId=${collect_id}`})
      }
    }
  },
  bindChange(event) {
    const { index } = event.detail
    this.data.current = index
    const { dataLists  } = this.data;
    const c = dataLists[index]
    if (c) {
      this.setData({
        [`panelDatas.list`]: c,
        pageStatus: c.length ? PAGE_STATUS.normal : PAGE_STATUS.empty
      });
    } else {
      this.loadData()
    }
  }
})