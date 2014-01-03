var assert = require('assert'),
    gingerbread = require('../index');

describe('gingerbread', function () {
  it('should return parsed results', function (done) {
    var originalText = 'The smelt of fliwers bring back memories.';

    gingerbread(originalText, function (error, text, result, corrections) {
      assert.equal(originalText, text);
      assert.equal('The smell of flowers brings back memories.', result);
      assert.equal(3, corrections.length);
      assert.equal(4, corrections[0].start);
      assert.equal(5, corrections[0].length);

      done();
    });
  })
})
