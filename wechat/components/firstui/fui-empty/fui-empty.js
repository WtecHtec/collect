// 本文件由FirstUI授权予车永钊（手机号： 1    827 6  4 5 3019，身份证尾号：227   0 1 0）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
Component({
  properties: {
    src: {
      type: String,
      value: ''
    },
    width: {
      type: String,
      optionalTypes:[Number],
      value: 576
    },
    height: {
      type: String,
      optionalTypes:[Number],
      value: 318
    },
    title: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    size: {
      type: String,
      optionalTypes:[Number],
      value: 32
    },
    descr: {
      type: String,
      value: ''
    },
    descrColor: {
      type: String,
      value: ''
    },
    descrSize: {
      type: String,
      optionalTypes:[Number],
      value: 24
    },
    isFixed: {
      type: Boolean,
      value: false
    },
    marginTop: {
      type: String,
      optionalTypes:[Number],
      value: 0
    }
  }
})