// 本文件由FirstUI授权予车永钊（手机号：1 82 76 4 5 30   1  9，身份证尾号：2  2 7 0 10）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
Component({
  properties: {
    model: {
      type: Object,
      value: {}
    },
    isSelect: {
      type: Boolean,
      value: false

    },
    selectedColor: {
      type: String,
      value: ''
    },
    //checkbox未选中时边框颜色
    borderColor: {
      type: String,
      value: '#ccc'
    },
    //是否显示图片
    isSrc: {
      type: Boolean,
      value: false
    },
    //次要内容是否居右侧
    subRight: {
      type: Boolean,
      value: true
    },
    last: {
      type: Boolean,
      value: false
    },
    idx: {
      type: Number,
      value: 0
    },
    index: {
      type: Number,
      value: 0
    }
  }
})