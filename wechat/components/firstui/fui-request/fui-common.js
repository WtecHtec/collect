const base = {
  //所有配置项，未设置则使用默认值
  config() {
    return {
      //接口域名，如：https://firstui.cn（如果host为空，则直接使用传入的目标地址url）
      host: '',
      // 接口地址：/order/getList（如果host为空，直接传入：https://firstui.cn/order/getList）
      url: '',
      //参数
      data: {},
      //请求头
      header: {
        /*
         * content-type:
         * application/x-www-form-urlencoded
         * application/json
         */
        'content-type': 'application/json'
      },
      //必须大写
      method: 'POST',
      //大于0时才生效，否则使用全局配置或者默认值
      timeout: 0,
      dataType: 'json',
      //是否阻止拦截重复的请求（重复：请求地址url + method + 参数data 一致）
      prevent: false,
      //Array<String> 参数data中的key，prevent为true时有效，进行重复请求判断时移除keys中相关参数，如时间戳、随机数等.
      keys: [],
      //是否仅返回简要数据：true-仅返回接口数据data，false-返回包含header、statusCode、errMsg、data等数据
      brief: false,
      //String 请求标记，用于中断该请求，不同请求不可重复，只可包含数字、字母、下划线，如：firstui_001
      cancelToken: '',
      showLoading: true,
      //加载中提示文本，showLoading为true时有效
      loadingText: '',
      errorMsg: '网络不给力，请检查网络设置！'
    }
  },
  getOptions(config) {
    let options = {
      ...config
    };
    ['host', 'timeout', 'prevent', 'keys', 'brief', 'cancelToken', 'showLoading', 'loadingText', 'errorMsg']
      .forEach(item => {
        delete options[item];
      })
    return options;
  },
  merge(a, b) {
    return Object.assign({}, a, b);
  },
  mergeConfig(defaultConfig, config, init) {
    let header = base.merge(defaultConfig.header, config.header || {});
    let params = base.merge(defaultConfig, config)
    params.header = header;
    if (!init) {
      let url = base.combineURLs(params.host, params.url)
      params.url = url;
    }
    return params;
  },
  //如果host为空，则直接使用传入的目标地址
  combineURLs(host, target) {
    return host ? host.replace(/\s+/g, '') + '/' + target.replace(/\s+/g, '').replace(/^\/+/, '') : target;
  },
  toast(text, duration, success) {
    text && wx.showToast({
      title: text,
      icon: success ? 'success' : 'none',
      duration: duration || 2000
    })
  },
  showLoading(title, mask = true) {
    wx.showLoading({
      mask: mask,
      title: title || '请稍候...'
    })
  }
}
export default base