// logs.js
const util = require('../../utils/util.js')
import Request from '../../utils/request'
Page({
  data: {
    logs: []
  },
  onLoad() {
		Request('/auth/refresh_token')
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  }
})
