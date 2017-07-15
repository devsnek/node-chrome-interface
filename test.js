const fs = require('fs');
const run = require('./');

run({ width: 300, height: 500 })
.then(async (page) => {
  // page.on('request', console.log);
  await page.load('<p>hi</p>');
  fs.writeFileSync('test.png', await page.screenshot({ fromSurface: true }));
  page.close();
})
.catch(console.error);
