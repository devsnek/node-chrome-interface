const EventEmitter = require('events');

class ChromeInterface extends EventEmitter {
  constructor({ protocol, chrome }) {
    super();
    this.protocol = protocol;
    this.chrome = chrome;
    protocol.Network.requestWillBeSent(({ request }) => {
      this.emit('request', request);
    });
  }

  load(str) {
    const url = /^(https?|file):\/\//.test(str) ? str :
      `data:text/html;base64,${Buffer.from(str).toString('base64')}`;
    return this.protocol.Page.navigate({ url });
  }

  screenshot() {
    return this.protocol.Page.captureScreenshot()
      .then(r => Buffer.from(r.data, 'base64'));
  }

  async close() {
    await this.protocol.close();
    await this.chrome.kill();
  }
}

module.exports = ChromeInterface;
