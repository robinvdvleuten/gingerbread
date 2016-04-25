var exec = require('child_process').exec,
    expect = require('chai').expect,
    gingerbread = require('../'),
    nock = require('nock');

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
      expect(error).to.be.null;
      expect(text).to.equal(originalText);
      expect(result).to.equal('The smell of flowers brings back memories.');
      expect(corrections).to.have.lengthOf(3);
      expect(corrections[0].start).to.equal(4);
      expect(corrections[0].length).to.equal(5);
      expect(corrections[1].start).to.equal(13);
      expect(corrections[1].length).to.equal(7);
      expect(corrections[2].start).to.equal(21);
      expect(corrections[2].length).to.equal(5);
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
      expect(error).to.be.null;
      expect(text).to.equal(originalText);
      expect(result).to.equal('The smelt of fliwers  back memories.');
      expect(corrections).to.have.lengthOf(1);
      expect(corrections[0].start).to.equal(21);
      expect(corrections[0].length).to.equal(5);
      done();
    });
  });
});
