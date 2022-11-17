import { PAGE_STATUS } from "../../../utils/config";

// pkgDetail/pages/msg_collect/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    noticeId: '',
    pageStatus: PAGE_STATUS.loading
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!options.noticeId) {
      this.setData({
        pageStatus: PAGE_STATUS.empty
      })
      return
    }
   
    this.data.noticeId = options.noticeId
    const userInfo = app.globalData.userInfo || {};
    this.setData({
      userInfo,
    })
    
  
  },
})