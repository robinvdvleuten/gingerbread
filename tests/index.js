var assert = require('assert'),
    exec = require('child_process').exec,
    gingerbread = require('../');

describe('gingerbread', function () {
  it('should return parsed results', function (done) {
    var originalText = 'The smelt of fliwers bring back memories.';

    gingerbread(originalText, function (error, text, result, corrections) {
      assert.equal(null, error);
      assert.equal(originalText, text);
      assert.equal('The smell of flowers brings back memories.', result);
      assert.equal(3, corrections.length);
      assert.equal(4, corrections[0].start);
      assert.equal(5, corrections[0].length);
      done();
    });
  });

  it('should return simple output when executing command', function (done) {
    exec('bin/gingerbread "Edwards will be sck yesterday"', function (error, stdout, stderr) {
      assert.equal("Edwards was sick yesterday\n", stdout);
      done();
    });
  });

  it('should return verbose output when executing command', function (done) {
    exec('bin/gingerbread -v "Edwards will be sck yesterday"', function (error, stdout, stderr) {
      var object = JSON.parse(stdout);

      assert.equal("Edwards will be sck yesterday", object.text);
      assert.equal("Edwards was sick yesterday\n", object.result);
      assert.equal(2, object.corrections.length);
      done();
    });
  });

  it('should return an error when request errors', function (done) {
    gingerbread('Hllo', {apiEndpoint: 'http://example.id/'}, function (error, text, result, corrections) {
      assert.notEqual(null, error);
      assert.equal("Couldn't connect to API endpoint (http://example.id/)", error.message);
      done();
    });
  });

  it('should return an error when json errors', function (done) {
    gingerbread('Hllo', {apiEndpoint: 'http://subosito.com/'}, function (error, text, result, corrections) {
      assert.notEqual(null, error);
      assert.equal('Received an invalid JSON format', error.message);
      done();
    });
  });
});
