Component({
  options: {
    virtualHost: true
  },
  properties: {
    tabIndex: {
      type: Number,
      optionalTypes: [String],
      value: 0
    }
  },
  relations: {
    '../fui-vtabs/fui-vtabs': {
      type: 'ancestor',
      linked: function (target) {
        this.data.vtabs = target
        if (target && target.data.linkage) {
          this.init()
        }
      }
    }
  },
  data: {
    vtabs: null
  },
  lifetimes: {
    detached: function () {
      this.uninstall()
    }
  },
  methods: {
    init() {
      setTimeout(() => {
        this.calcHeight((height) => {
          this.data.vtabs.getCalcHeight(height, Number(this.data.tabIndex))
        })
      }, 300)
    },
    calcHeight(callback, index = 0) {
      wx.createSelectorQuery()
        .in(this)
        .select(`#fui-vtabs-content__${this.data.tabIndex}`)
        .fields({
          size: true
        }, data => {
          if (index >= 12) return
          if (data && data.height) {
            callback && callback(data.height)
          } else {
            index++
            setTimeout(() => {
              this.calcHeight(callback, index)
            }, 50)
            return
          }
        })
        .exec()
    },
    uninstall() {
      let vtabs = this.data.vtabs
      if (vtabs && vtabs.data.linkage) {
        this.data.vtabs.uninstall(Number(this.data.tabIndex), this)
      }
    }
  }
})