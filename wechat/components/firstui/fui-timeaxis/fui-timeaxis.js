Component({
  properties: {
    padding: {
      type: String,
      value: "0"
    },
    background: {
      type: String,
      value: 'transparent'
    },
    leftWidth: {
      type: Number,
      optionalTypes: [String],
      value: 0,
      observer(val) {
        this.data.children.forEach(item => {
          item.setData({
            leftWidth: val
          })
        })
      }
    },
    width: {
      type: Number,
      optionalTypes: [String],
      value: 48,
      observer(val) {
        this.data.children.forEach(item => {
          item.setData({
            width: val
          })
        })
      }
    },
    lineWidth: {
      type: Number,
      optionalTypes: [String],
      value: 1,
      observer(val) {
        this.data.children.forEach(item => {
          item.setData({
            lineWidth: val
          })
        })
      }
    }
  },
  relations: {
    '../fui-timeaxis-node/fui-timeaxis-node': {
      type: 'descendant',
      linked: function (target) {
        this.data.children.push(target)
      }
    }
  },
  data: {
    children: []
  }
})