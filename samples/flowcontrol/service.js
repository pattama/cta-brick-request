'use strict';

const Brick = require('cta-brick');
const methods = ['GET', 'POST', 'PUT', 'DELETE'];

class Service extends Brick {

  constructor(cementHelper, config) {
    super(cementHelper, config);
    this.apiURL = config.properties.apiURL;
  }

  start() {
    super.start();
    const that = this;
    setInterval(() => {
      const index = Math.floor(4 * Math.random());
      const method = methods[index];
      that.cementHelper.createContext({
        nature: {
          type: 'request',
          quality: 'exec',
        },
        payload: {
          method: method,
          url: that.apiURL,
        },
      }).publish();
    }, 1000);
  }
}

module.exports = Service;
