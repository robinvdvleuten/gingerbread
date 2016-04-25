var exec = require('child_process').exec,
    expect = require('chai').expect,
    gingerbread = require('../');

describe('gingerbread command-line interface', function () {
  it('should return simple output when executing command', function (done) {
    exec('bin/gingerbread "Edwards will be sck yesterday"', function (error, stdout, stderr) {
      expect(error).to.be.null;
      expect(stdout).to.equal("Edwards was sick yesterday\n");
      done();
    });
  });

  it('should return verbose output when executing command', function (done) {
    exec('bin/gingerbread -v "Edwards will be sck yesterday"', function (error, stdout, stderr) {
      var object = JSON.parse(stdout);

      expect(error).to.be.null;
      expect(object.text).to.equal("Edwards will be sck yesterday");
      expect(object.result).to.equal("Edwards was sick yesterday\n");
      expect(object.corrections).to.have.lengthOf(2);
      done();
    });
  });

  it('should return an error when request errors', function (done) {
    gingerbread('Hllo', {apiEndpoint: 'http://example.id/'}, function (error, text, result, corrections) {
      expect(error).not.to.be.null;
      expect(error.message).to.equal("Couldn't connect to API endpoint (http://example.id/)");
      done();
    });
  });

  it('should return an error when json errors', function (done) {
    gingerbread('Hllo', {apiEndpoint: 'http://subosito.com/'}, function (error, text, result, corrections) {
      expect(error).not.to.be.null;
      expect(error.message).to.match(/^Received an invalid JSON format:/);
      done();
    });
  });
});
