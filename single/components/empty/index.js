import { IMG_MAP } from "./config";

Component({
  properties: {
		type: {
			type: String,
			value: 0,
		},
    src: {
      type: String,
      value: ''
    },
    width: {
      type: String,
      optionalTypes:[Number],
      value: 128
    },
    height: {
      type: String,
      optionalTypes:[Number],
      value: 128
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
  },
	data: {
		imgMap: IMG_MAP
	}
})