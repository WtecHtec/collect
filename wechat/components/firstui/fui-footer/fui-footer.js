// 本文件由FirstUI授权予车永钊（手机号：1 8276     45 3  0 19，身份证尾号： 2  27 01 0）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
Component({
  properties: {
    //url，openType，delta ，text，color，size
    //链接设置  object数据格式对应上面注释的属性值
    navigate: {
      type: Array,
      value: []
    },
    //底部文本
    text: {
      type: String,
      value: ''
    },
    //文本字体颜色
    color: {
      type: String,
      value: "#B2B2B2"
    },
    //文本字体大小
    size: {
      type: Number,
      optionalTypes: [String],
      value: 24
    },
    //footer背景颜色
    background: {
      type: String,
      value: "transparent"
    },
    //分隔线颜色，仅nvue生效
    borderColor: {
      type: String,
      value: '#B2B2B2'
    },
    //是否固定在底部
    isFixed: {
      type: Boolean,
      value: false
    }
  }
})