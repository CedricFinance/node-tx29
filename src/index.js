var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Emitter(port) {
  EventEmitter.call(this);
  var _this = this;

  port.on('data', function(data) { _this._onRawData(data); });

  port.on('error', function(data) { _this._onError(data); });
}

util.inherits(Emitter, EventEmitter);

Emitter.prototype._parse = function(rawData) {
  var fields = rawData.split(',');
  return {
    sensorId: fields[0],
    temperature: Number(fields[1]),
    humidity: Number(fields[2]),
    resetFlag: fields[3] == 'R',
    lowBatteryFlag: fields[4] == 'B',
  };
};

Emitter.prototype._onRawData = function(rawData) {
  var decoded = this._parse(rawData);
  if (decoded.sensorId.length > 2) {
    this.emit('status-invalid-data', decoded);
  } else {
    this.emit('status-valid-data', decoded);
  }
};

Emitter.prototype._onError = function(error) {
  this.emit('status-error', error);
};

module.exports = Emitter;
