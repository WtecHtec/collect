// 本文件由FirstUI授权予车永钊（手机号：  1  82    7645301  9，身份证尾号：22  70 1  0）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
Component({
  properties: {
    //是否显示
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    size: {
      type: Number,
      optionalTypes: [String],
      value: 34
    },
    color: {
      type: String,
      value: '#333'
    },
    descr: {
      type: String,
      value: ''
    },
    descrSize: {
      type: Number,
      optionalTypes: [String],
      value: 28
    },
    descrColor: {
      type: String,
      value: '#7F7F7F'
    },
    buttons: {
      type: Array,
      value: [{
        text: '取消',
        plain: true
      }, {
        text: '确定'
      }],
      observer(val) {
        this.initData(val)
      }
    },
    //row、column
    direction: {
      type: String,
      value: 'row'
    },
    radius: {
      type: Number,
      optionalTypes: [String],
      value: 16
    },
    width: {
      type: Number,
      optionalTypes: [String],
      value: 640
    },
    background: {
      type: String,
      value: '#FFFFFF'
    },
    boxRadius: {
      type: Number,
      optionalTypes: [String],
      value: 16
    },
    maskBackground: {
      type: String,
      value: 'rgba(0,0,0,.6)'
    },
    maskClosable: {
      type: Boolean,
      value: false
    },
    zIndex: {
      type: Number,
      value: 1001
    }
  },
  data: {
    vals: []
  },
  lifetimes: {
    attached: function () {
      this.initData(this.data.buttons)
    }
  },
  methods: {
    initData(vals) {
      if (vals && vals.length > 0) {
        if (typeof vals[0] !== 'object') {
          vals = vals.map(item => {
            return {
              text: item
            }
          })
        }
        this.setData({
          vals: vals
        })
      }
    },
    stop() {},
    closeModal() {
      if (!this.data.maskClosable) return;
      this.triggerEvent('cancel', {});
    },
    handleClick(e) {
      let index = Number(e.currentTarget.dataset.index)
      if (!this.data.show) return;
      this.triggerEvent('click', {
        index: Number(index),
        ...this.data.vals[index]
      });
    }
  }
})