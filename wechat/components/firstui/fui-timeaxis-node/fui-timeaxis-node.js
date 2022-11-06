Component({
  options: {
    multipleSlots: true,
    virtualHost: true
  },
  properties: {
    lined: {
      type: Boolean,
      value: true
    },
    lineColor: {
      type: String,
      value: '#ccc'
    }
  },
  relations: {
    '../fui-timeaxis/fui-timeaxis': {
      type: 'ancestor',
      linked: function (target) {
        this.data.timeaxis = target
        this.init()
      }
    }
  },
  data: {
    timeaxis: null,
    lineWidth: 1,
    width: 48,
    leftWidth: 0
  },
  methods: {
    init() {
      const parent = this.data.timeaxis;
      if (parent) {
        this.setData({
          width: parent.data.width,
          lineWidth: parent.data.lineWidth,
          leftWidth: parent.data.leftWidth
        })
      }
    }
  }
})