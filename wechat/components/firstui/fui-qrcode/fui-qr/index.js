import QRCode from './lib/QRCode.js'
import ErrorCorrectLevel from './lib/ErrorCorrectLevel.js'

var qrcode = function (data, opt) {
  opt = opt || {};
  var qr = new QRCode(opt.typeNumber || -1,
    opt.errorCorrectLevel || ErrorCorrectLevel.H);
  qr.addData(data);
  qr.make();

  return qr;
};

qrcode.ErrorCorrectLevel = ErrorCorrectLevel;

export default qrcode;
