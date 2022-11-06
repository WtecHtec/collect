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