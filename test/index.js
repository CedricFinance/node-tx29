var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var EventEmitter = require('events').EventEmitter;

var NodeTx29 = require('../src/index');

describe('NodeTx29', function() {
  var fakePort;
  var nodeTx29;

  beforeEach(function() {
    fakePort = new EventEmitter();
    nodeTx29 = new NodeTx29(fakePort);
  });

  describe('decoding', function() {

    it('should parse the sensor id', function() {
      expect(nodeTx29._parse('10,23.10,54,,')).to.have.property('sensorId').equal('10');
    });

    it('should parse the temperature', function() {
      expect(nodeTx29._parse('10,23.10,54,,')).to.have.property('temperature').equal(23.10);
    });

    it('should parse the humidity', function() {
      expect(nodeTx29._parse('10,23.10,54,,')).to.have.property('humidity').equal(54);
    });

    describe('newly started sensor', function() {
      it('should parse the reset flag', function() {
        expect(nodeTx29._parse('10,23.10,54,R,')).to.have.property('resetFlag').true;
      });
    }),

    describe('long running sensor', function() {
      it('should parse the reset flag', function() {
        expect(nodeTx29._parse('10,23.10,54,,')).to.have.property('resetFlag').false;
      });
    });

    describe('full battery sensor', function() {
      it('should parse the low battery flag', function() {
        expect(nodeTx29._parse('10,23.10,54,,')).to.have.property('lowBatteryFlag').false;
      });
    });

    describe('low battery sensor', function() {
      it('should parse the low battery flag', function() {
        expect(nodeTx29._parse('10,23.10,54,,B')).to.have.property('lowBatteryFlag').true;
      });
    });
  });

  describe('emitting', function() {

    it('should emit errors', function() {
      var parseMock = sinon.mock(nodeTx29);

      var spy = sinon.spy();
      nodeTx29.on('status-error', spy);

      nodeTx29._onError({ error: 'Error' });

      expect(spy).to.have.been.calledWith({ error: 'Error' });
    });

    describe('valid sensor data', function() {
      var decodedData;
      var spy;

      beforeEach(function() {
        var parseMock = sinon.mock(nodeTx29);
        decodedData = { sensorId: '1C', temperature: 16 };
        parseMock.expects('_parse').onFirstCall().returns(decodedData);
      });

      it('should emit decoded data', function() {
        var spy = sinon.spy();
        nodeTx29.on('status-valid-data', spy);

        nodeTx29._onRawData();

        expect(spy).to.have.been.calledWith(decodedData);
      });

      it('should not emit invalid data', function() {
        var spy = sinon.spy();
        nodeTx29.on('status-invalid-data', spy);

        nodeTx29._onRawData();

        expect(spy).to.not.have.been.calledWith(decodedData);
      });
    });

    describe('invalid sensor data', function() {
      var decodedData;
      var spy;

      beforeEach(function() {
        var parseMock = sinon.mock(nodeTx29);
        decodedData = { sensorId: 'BAD', temperature: 16 };
        parseMock.expects('_parse').onFirstCall().returns(decodedData);
      });

      it('should emit invalid data', function() {
        var spy = sinon.spy();
        nodeTx29.on('status-invalid-data', spy);

        nodeTx29._onRawData();

        expect(spy).to.have.been.calledWith(decodedData);
      });

      it('should not emit valid data', function() {
        var spy = sinon.spy();
        nodeTx29.on('status-valid-data', spy);

        nodeTx29._onRawData();

        expect(spy).to.not.have.been.calledWith(decodedData);
      });
    });
  });

  describe('listening', function() {

    it('should listen to the serial port "data" event', function() {
      var stub = sinon.stub(nodeTx29, '_onRawData');

      fakePort.emit('data', '');

      expect(stub).to.have.been.called;
    });

    it('should listen to the serial port "error" event', function() {
      var stub = sinon.stub(nodeTx29, '_onError');

      fakePort.emit('error', '');

      expect(stub).to.have.been.called;
    });
  });
});
