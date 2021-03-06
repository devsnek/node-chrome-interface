const EventEmitter = require('events');

class ChromeInterface extends EventEmitter {
  constructor({ protocol, chrome }) {
    super();
    this.protocol = protocol;
    this.chrome = chrome;
    protocol.Network.requestWillBeSent(({ request }) => {
      this.emit('request', request);
    });
    protocol.Console.messageAdded(message => {
      this.emit('console', message);
    });
  }

  load(str) {
    const url = /^(https?|file):\/\//.test(str) ? str : `data:text/html,${str}`;
    return this.protocol.Page.navigate({ url });
  }

  screenshot(options = {}) {
    if (process.platform === 'darwin') options.fromSurface = true;
    return this.protocol.Page.captureScreenshot(options)
      .then(r => Buffer.from(r.data, 'base64'));
  }

  async close() {
    await this.protocol.close();
    await this.chrome.kill();
  }
}

module.exports = ChromeInterface;
