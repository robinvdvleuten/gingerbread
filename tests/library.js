var assert = require('assert'),
    nock = require('nock'),
    exec = require('child_process').exec,
    gingerbread = require('../');

describe('gingerbread library', function () {
  it('should return parsed results when receiving suggestions', function (done) {
    var gingerRequest = nock('http://services.gingersoftware.com').get('/Ginger/correct/json/GingerTheText?text=The%20smelt%20of%20fliwers%20bring%20back%20memories.&lang=US&apiKey=6ae0c3a0-afdc-4532-a810-82ded0054236&clientVersion=2.0').reply(200, {
      LightGingerTheTextResult: [
        {
          From: 4,
          Suggestions: [
            {LrnCatId: 1000, Text: 'smell' }
          ],
          To: 8
        },
        {
          From: 13,
          Suggestions: [
            { Definition: 'a plant cultivated for its blooms or blossoms', LrnCatId: 31, Text: 'flowers' }
          ],
          To: 19
        },
        {
          From: 21,
          Suggestions: [
            { LrnCatId: 21, Text: 'brings' }
          ],
          To: 25
        }
      ]
    });

    var originalText = 'The smelt of fliwers bring back memories.';

    gingerbread(originalText, function (error, text, result, corrections) {
      assert.equal(null, error);
      assert.equal(originalText, text);
      assert.equal('The smell of flowers brings back memories.', result);
      assert.equal(3, corrections.length);
      assert.equal(4, corrections[0].start);
      assert.equal(5, corrections[0].length);
      assert.equal(13, corrections[1].start);
      assert.equal(7, corrections[1].length);
      assert.equal(21, corrections[2].start);
      assert.equal(5, corrections[2].length);
      done();
    });
  });

  it('should return parsed results when not receiving suggestions', function (done) {
    var gingerRequest = nock('http://services.gingersoftware.com').get('/Ginger/correct/json/GingerTheText?text=The%20smelt%20of%20fliwers%20bring%20back%20memories.&lang=US&apiKey=6ae0c3a0-afdc-4532-a810-82ded0054236&clientVersion=2.0').reply(200, {
      LightGingerTheTextResult: [
        {
          From: 21,
          Suggestions: [],
          To: 25
        }
      ]
    });

    var originalText = 'The smelt of fliwers bring back memories.';

    gingerbread(originalText, function (error, text, result, corrections) {
      assert.equal(null, error);
      assert.equal(originalText, text);
      assert.equal('The smelt of fliwers  back memories.', result);
      assert.equal(1, corrections.length);
      assert.equal(21, corrections[0].start);
      assert.equal(5, corrections[0].length);
      done();
    });
  });
});
