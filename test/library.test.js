const test = require('ava');
const nock = require('nock');
const gingerbread = require('../lib');

test.cb('should return parsed results when receiving suggestions', t => {
  t.plan(10)

  nock('http://services.gingersoftware.com').get('/Ginger/correct/json/GingerTheText?text=The%20smelt%20of%20fliwers%20bring%20back%20memories.&lang=US&apiKey=6ae0c3a0-afdc-4532-a810-82ded0054236&clientVersion=2.0').reply(200, {
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

  const originalText = 'The smelt of fliwers bring back memories.';

  gingerbread(originalText, function (error, text, result, corrections) {
    t.falsy(error);
    t.is(text, originalText);
    t.is(result, 'The smell of flowers brings back memories.');
    t.is(corrections.length, 3);
    t.is(corrections[0].start, 4);
    t.is(corrections[0].length, 5);
    t.is(corrections[1].start, 13);
    t.is(corrections[1].length, 7);
    t.is(corrections[2].start, 21);
    t.is(corrections[2].length, 5);
    t.end();
  });
});

test.cb('should return parsed results when not receiving suggestions', t => {
  t.plan(6);
  
  nock('http://services.gingersoftware.com').get('/Ginger/correct/json/GingerTheText?text=The%20smelt%20of%20fliwers%20bring%20back%20memories.&lang=US&apiKey=6ae0c3a0-afdc-4532-a810-82ded0054236&clientVersion=2.0').reply(200, {
    LightGingerTheTextResult: [
      {
        From: 21,
        Suggestions: [],
        To: 25
      }
    ]
  });

  const originalText = 'The smelt of fliwers bring back memories.';

  gingerbread(originalText, function (error, text, result, corrections) {
    t.falsy(error);
    t.is(text, originalText);
    t.is(result, 'The smelt of fliwers  back memories.');
    t.is(corrections.length, 1);
    t.is(corrections[0].start, 21);
    t.is(corrections[0].length, 5);
    t.end();
  });
});
