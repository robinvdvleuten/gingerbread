var request = require('request'),
    url = require('url'),
    apiEndpoint = 'http://services.gingersoftware.com/Ginger/correct/json/GingerTheText',
    apiVersion = '2.0',
    apiKey = '6ae0c3a0-afdc-4532-a810-82ded0054236',
    defaultLang = 'US';

module.exports = function (text, callback) {
  var uri = url.parse(apiEndpoint);
  uri.query = {text: text, lang: defaultLang, apiKey: apiKey, clientVersion: apiVersion};

  request({uri: url.format(uri)}, function (error, response, body) {
    var data = JSON.parse(body),
        suggestion,
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
          text: text.substr(suggestion.from, (suggestion.to + 1) - suggestion.from),
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
