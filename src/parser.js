function parser(data) {
  var fields = data.split(',');
  return {
    sensorId: fields[0],
    temperature: Number(fields[1]),
    humidity: Number(fields[2]),
    resetFlag: fields[3] == 'R',
    lowBatteryFlag: fields[4] == 'B',
  };
}

module.exports = parser;
