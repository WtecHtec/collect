Component({
  properties: {
    options: {
      type: Array,
      value: [],
      observer(vals) {
        this.initData(vals)
      }
    },
    value: {
      type: Array,
      optionalTypes: [String, Number],
      value: [],
      observer(vals) {
        this.modelChange(vals)
      }
    },
    multiple: {
      type: Boolean,
      value: false
    },
    min: {
      type: String,
      optionalTypes: [Number],
      value: 1
    },
    //最大选择数
    max: {
      type: String,
      optionalTypes: [Number],
      value: -1
    },
    width: {
      type: String,
      optionalTypes: [Number],
      value: 0
    },
    height: {
      type: String,
      optionalTypes: [Number],
      value: 0
    },
    padding: {
      type: String,
      value: '16rpx 32rpx'
    },
    gap: {
      type: String,
      optionalTypes: [Number],
      value: 20
    },
    radius: {
      type: String,
      optionalTypes: [Number],
      value: 6
    },
    size: {
      type: String,
      optionalTypes: [Number],
      value: 24
    },
    color: {
      type: String,
      value: '#333'
    },
    activeColor: {
      type: String,
      value: '#465CFF'
    },
    background: {
      type: String,
      value: '#fff'
    },
    activeBgColor: {
      type: String,
      value: '#fff'
    },
    borderColor: {
      type: String,
      value: '#465CFF'
    },
    //设为true时，圆角值不建议设过大
    mark: {
      type: Boolean,
      value: false
    },
    markSize: {
      type: String,
      optionalTypes: [Number],
      value: 52
    },
    markColor: {
      type: String,
      value: '#465CFF'
    }
  },
  lifetimes: {
    attached: function () {
      this.initData(this.data.options)
    }
  },
  data: {
    icon: '\ue600',
    dataList: [],
    val: '',
    vals: []
  },
  methods: {
    initData(vals) {
      vals = JSON.parse(JSON.stringify(vals))
      if (vals && vals.length > 0) {
        if (typeof vals[0] !== 'object') {
          vals = vals.map((item, index) => {
            return {
              text: item,
              value: item,
              selected: false
            }
          })
        } else {
          vals.map((item, index) => {
            item.selected = false
            if (item.value === undefined) {
              item.value = item.text
            }
          })
        }
        this.setData({
          dataList: vals
        })
        this.modelChange(this.data.value)
      }
    },
    emitsChange(e) {
      this.triggerEvent('change', e)
      let val = Array.isArray(e.value) ? JSON.stringify(e.value) : e.value
      this.setData({
        value: val
      })
    },
    radioChange(index, model) {
      let min = Number(this.data.min)
      if (this.data.val === model.value && min > 0) return;
      let val = '';
      let i = index
      this.data.dataList.forEach((item, idx) => {
        if (idx === index) {
          const bool = this.data.val === item.value && min <= 0
          val = bool ? '' : item.value
          i = bool ? -1 : index
          item.selected = bool ? false : true
        } else {
          item.selected = false
        }
      })
      this.setData({
        val: val,
        dataList: this.data.dataList
      })
      let e = {
        index: i,
        value: val
      }
      this.emitsChange(e)
    },
    checkboxChange(index, model) {
      let max = Number(this.data.max)
      let vals = this.data.vals
      let i = vals.indexOf(model.value)
      if (vals.length >= max && max !== -1 && i === -1) {
        wx.showToast({
          title: `最多只能选择${max}个选项`,
          icon: 'none'
        })
        return
      }
      this.data.dataList.forEach((item, idx) => {
        if (idx === index) {
          item.selected = i !== -1 ? false : true
          if (item.selected) {
            vals.push(item.value)
          } else {
            vals.splice(i, 1)
          }
        }
      })
      this.setData({
        vals: vals
      })
      let e = {
        value: vals
      }
      this.emitsChange(e)
    },
    modelChange(vals) {
      if (this.data.multiple) {
        vals = typeof vals === 'string' ? JSON.parse(vals) : vals;
        this.data.dataList.forEach(item => {
          if (vals.includes(item.value)) {
            item.selected = true;
          } else {
            item.selected = false
          }
        })
        this.setData({
          vals: vals,
          dataList: this.data.dataList
        })

      } else {
        this.data.dataList.forEach(item => {
          if (vals == item.value) {
            item.selected = true;
          } else {
            item.selected = false
          }
        })
        this.setData({
          val: vals,
          dataList: this.data.dataList
        })
      }
    },
    handleClick(e) {
      let index = Number(e.currentTarget.dataset.index)
      let item = this.data.dataList[index]
      if (item.disable) return;
      if (this.data.multiple) {
        this.checkboxChange(index, item)
      } else {
        this.radioChange(index, item)
      }
    }
  }
})