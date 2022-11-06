// 本文件由FirstUI授权予车永钊（手机号：1   82 76  4   530 19，身份证尾号：2 2  7 01 0）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
var statusBarHeight = wx.getSystemInfoSync().statusBarHeight + 'px'
Component({
  properties: {
    //背景色
    background: {
      type: String,
      value: 'transparent'
    },
    //是否固定在顶部
    isFixed: {
      type: Boolean,
      value: false
    },
    //z-index值，isFixed为true时生效
    zIndex: {
      type: Number,
      value: 99
    }
  },
  data: {
    statusBarHeight
  },
  lifetimes: {
     attached:function(){
      this.triggerEvent('init', {
				statusBarHeight: statusBarHeight
			})
     }
  }
})