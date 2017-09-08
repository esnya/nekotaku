const _ = require('lodash');
const fs = require('fs');

fs.readFile('config/config.firebase.json', (e, file) => {
  if (e) {
    console.error(e);
    return process.exit(1);
  }

  const src = JSON.parse(file.toString()).backend;
  const dst = _.mapValues(src, (value) => {
    if (value.match(/^FIREBASE_/)) {
      return process.env[value];
    }
    return value;
  });

  return fs.writeFile('config/config.json', JSON.stringify({ backend: dst }), (e) => {
    if (e) {
      console.error(e);
      return process.exit(2);
    }
  });
});
