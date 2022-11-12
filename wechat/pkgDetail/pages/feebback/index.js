import { subitFeebBack } from '../../server/dataserver'
import { setStorage, getStorage } from '../../../utils/util'
import { FEEBBACK_KEY } from '../../../utils/storage-keys'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fbInfo: ''
  },
  fbSubmit() {
    if (!this.data.fbInfo || !this.data.fbInfo.trim()) {
      wx.showToast({
        title: '反馈内容不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }  
    this._subitFeebBack(this.data.fbInfo)
  },
  async _subitFeebBack(desc) {
    const [err, res] = await subitFeebBack(desc)
    if (!err && res ) {
      if (res.code === 200) {
        wx.showToast({
          title: '反馈成功',
          icon: 'none',
          duration: 2000
        })
        const cacheInfo = getStorage(FEEBBACK_KEY) || { num: 0, time: new Date().getTime() }
        cacheInfo.num += 1
        setStorage(FEEBBACK_KEY, cacheInfo) 
      } else if (res.code === 202) {
        wx.showToast({
          title: '24小时内，只能反馈2条',
          icon: 'none',
          duration: 2000
        })
      }
      return
    } 
    wx.showToast({
      title: '反馈失败',
      icon: 'none',
      duration: 2000
    })
  }
})