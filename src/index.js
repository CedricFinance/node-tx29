var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Emitter(port) {
  EventEmitter.call(this);
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
  this.emit('data', this._parse(rawData));
};

Emitter.prototype._onError = function(error) {
  this.emit('error', error);
};

module.exports = Emitter;
