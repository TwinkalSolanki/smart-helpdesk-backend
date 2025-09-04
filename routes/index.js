const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  const routesPath = __dirname;

  fs.readdirSync(routesPath).forEach((file) => {
    if (file === 'index.js') return;

    try {
      const route = require(path.join(routesPath, file));

      if (typeof route === 'function') {
        route(app); // pass app directly to each route file
        console.log(`Loaded route file: ${file}`);
      } else {
        console.warn(`Skipped ${file} (not a function export)`);
      }
    } catch (err) {
      console.error(`Failed to load route file: ${file}`);
      console.error(err);
    }
  });
};