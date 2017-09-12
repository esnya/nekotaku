const _ = require('lodash');
const fs = require('fs');

function replace(obj) {
  return _.mapValues(obj, (value) => {
    if (Array.isArray(value)) return value;
    else if (typeof value === 'object') return replace(value);
    else if (value.match(/^[A-Z][A-Z_0-9]*$/) && value in process.env) return process.env[value];

    return value;
  });
}

function onRead(e, file) {
  if (e) {
    console.error(e);
    return process.exit(1);
  }

  const src = JSON.parse(file.toString());
  const dst = replace(src);

  return console.log(JSON.stringify(dst, null, '  '));
}

fs.readFile('config/config.trial-server.json', onRead);
