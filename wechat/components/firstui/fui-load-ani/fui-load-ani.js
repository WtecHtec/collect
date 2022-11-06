Component({
  properties: {
    type: {
      type: Number,
      optionalTypes: [String],
      value: 1
    },
    color: {
      type: String,
      value: ''
    },
    isFixed: {
      type: Boolean,
      value: false
    }
  }
})