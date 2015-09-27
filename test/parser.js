var chai = require('chai');
var expect = chai.expect;

describe('Parser', function() {
  var parser;

  before(function() {
    parser = require('../src/parser');
  });

  it('should parse the sensor id', function() {
    expect(parser('10,23.10,54,,')).to.have.property('sensorId').equal('10');
  });

  it('should parse the temperature', function() {
    expect(parser('10,23.10,54,,')).to.have.property('temperature').equal(23.10);
  });

  it('should parse the humidity', function() {
    expect(parser('10,23.10,54,,')).to.have.property('humidity').equal(54);
  });

  describe('newly started sensor', function() {
    it('should parse the reset flag', function() {
      expect(parser('10,23.10,54,R,')).to.have.property('resetFlag').true;
    });
  }),

  describe('long running sensor', function() {
    it('should parse the reset flag', function() {
      expect(parser('10,23.10,54,,')).to.have.property('resetFlag').false;
    });
  });

  describe('full battery sensor', function() {
    it('should parse the low battery flag', function() {
      expect(parser('10,23.10,54,,')).to.have.property('lowBatteryFlag').false;
    });
  });

  describe('low battery sensor', function() {
    it('should parse the low battery flag', function() {
      expect(parser('10,23.10,54,,B')).to.have.property('lowBatteryFlag').true;
    });
  });
});
