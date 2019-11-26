const { exec } = require('child_process');
const test = require('ava');
const gingerbread = require('../lib');

test.cb('should return simple output when executing command', t => {
  t.plan(2);
  
  exec('bin/gingerbread "Edwards will be sck yesterday"', function (error, stdout, stderr) {
    t.falsy(error);
    t.is(stdout, "Edwards was sick yesterday\n");
    t.end()
  });
});

test.cb('should return verbose output when executing command', t => {
  t.plan(4);

  exec('bin/gingerbread -v "Edwards will be sck yesterday"', function (error, stdout, stderr) {
    const object = JSON.parse(stdout);

    t.falsy(error);
    t.is(object.text, "Edwards will be sck yesterday");
    t.is(object.result, "Edwards was sick yesterday\n");
    t.is(object.corrections.length, 2);
    t.end();
  });
});

test.cb('should return an error when request errors', t => {
  t.plan(2);

  gingerbread('Hllo', {apiEndpoint: 'http://example.id/'}, function (error, text, result, corrections) {
    t.truthy(error);
    t.is(error.message, "Couldn't connect to API endpoint (http://example.id/)");
    t.end();
  });
});

test.cb('should return an error when json errors', t => {
  t.plan(2);

  gingerbread('Hllo', {apiEndpoint: 'http://subosito.com/'}, function (error, text, result, corrections) {
    t.truthy(error);
    t.regex(error.message, /^Received an invalid JSON format:/);
    t.end();
  });
});
