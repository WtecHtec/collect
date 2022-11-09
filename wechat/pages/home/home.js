// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profile_icture_src: "/static/img/test/img_logo.jpg",
    name: "BeanC",
    tel: "13471422178",
    current: 0,
    items: [{
      background: '#39b778'
    }, {
      background: '#FFB703'
    }, {
      background: '#B2B2B2'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 轮播图三个点的切换
   * @param {*} e 
   */
  change(e) {
    this.setData({
      current: e.detail.current
    })
  },
  /**
   * 轮播图点击事件
   */
  onClickSwiper() {
    console.log('我是轮播图');
  }
})