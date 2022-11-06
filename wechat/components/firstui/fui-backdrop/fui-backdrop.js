// 本文件由FirstUI授权予车永钊（手机号： 1  8  276 45    3019，身份证尾号： 2 2 70  10）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    background: {
      type: String,
      value: ''
    },
    absolute: {
      type: Boolean,
      value: false
    },
    zIndex: {
      type: Number,
      value: 999
    },
    closable: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    handleClick() {
      if (this.data.closable && this.data.show) {
        this.triggerEvent('click')
      }
    }
  }
})