var request = require('request'),
    url = require('url'),
    _ = require('underscore');

var defaults = {
  apiEndpoint: 'http://services.gingersoftware.com/Ginger/correct/json/GingerTheText',
  apiKey: '6ae0c3a0-afdc-4532-a810-82ded0054236',
  apiVersion: '2.0',
  lang: 'US',
};

module.exports = function (text, options, callback) {
  if (callback == undefined && typeof options == 'function') {
    callback = options;
    options = {};
  }

  options = _.defaults(options, defaults);

  var uri = url.parse(options.apiEndpoint);
  uri.query = {text: text, lang: options.lang, apiKey: options.apiKey, clientVersion: options.apiVersion};

  request({uri: url.format(uri)}, function (error, response, body) {
    if (error) {
      return callback(new Error('Couldn\'t connect to API endpoint (' + options.apiEndpoint + ')'));
    }

    try {
      var data = JSON.parse(body);
    } catch (error) {
      return callback(new Error('Received an invalid JSON format'));
    }

    var suggestion,
        definition,
        result = '',
        corrections = [],
        i = 0;

    for (var index in data.LightGingerTheTextResult) {
      suggestion = data.LightGingerTheTextResult[index];

      if (i <= suggestion.From) {
        if (suggestion.From != 0) {
          result += text.substr(i, suggestion.From - i);
        }

        result += suggestion.Suggestions[0].Text;

        definition = suggestion.Suggestions[0].Definition;
        definition = definition === undefined ? null : definition;

        corrections.push({
          text: text.substr(suggestion.From, suggestion.To - suggestion.From + 1),
          correct: suggestion.Suggestions[0].Text,
          definition: definition,
          start: suggestion.From,
          length: suggestion.To - suggestion.From + 1,
        });
      }

      i = suggestion.To + 1;
    }

    if (i < text.length) {
      result += text.substring(i);
    }

    callback(null, text, result, corrections)
  });
}
