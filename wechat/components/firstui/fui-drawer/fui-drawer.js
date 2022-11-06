// 本文件由FirstUI授权予车永钊（手机号：18 2 7    645 3 01  9，身份证尾号：2  270  1 0）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    //left/right
    direction: {
      type: String,
      value: 'right'
    },
    //背景颜色
    background: {
      type: String,
      value: '#fff'
    },
    zIndex: {
      type: Number,
      optionalTypes:[String],
      value: 996
    },
    //点击遮罩 是否可关闭
    maskClosable: {
      type: Boolean,
      value: true
    },
    maskBackground: {
      type: String,
      value: 'rgba(0,0,0,.6)'
    }
  },
  methods: {
    stop() {},
    handleClose(e) {
      if (!this.data.maskClosable) return;
      this.triggerEvent('close', {});
    }
  }
})