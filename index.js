const cdp = require('chrome-remote-interface');
const { launch } = require('chrome-launcher');
const ChromeInterface = require('./ChromeInterface');

async function run(options = {}) {
  options.chromeFlags = [`--window-size=${options.width || 800},${options.height || 600}`];
  if (options.headless !== false) options.chromeFlags.push('--headless', '--disable-gpu');
  options.logLevel = 'silent';

  const chrome = await launch(options);
  const protocol = await cdp({ port: chrome.port });

  const { Network, Page, Console } = protocol;
  const page = new ChromeInterface({ protocol, chrome });
  await Promise.all([Network.enable(), Page.enable(), Console.enable()]);
  return page;
}

module.exports = run;
