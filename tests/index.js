var assert = require('assert'),
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

  it('should return an error when request errors', function (done) {
    gingerbread('Hllo', {apiEndpoint: 'http://example.id/'}, function (error, text, result, corrections) {
      assert.notEqual(null, error);
      assert.equal('Couldn\'t connect to API endpoint (http://example.id/)', error.message);
      done();
    });
  });
})
