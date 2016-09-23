'use strict';

module.exports = {
  tools: [{
    name: 'request',
    module: 'cta-tool-request',
    properties: {},
  }],
  bricks: [{
    name: 'Request',
    module: 'cta-brick-request',
    dependencies: {
      request: 'request',
    },
    properties: {},
    subscribe: [{
      topic: 'requests.com',
      data: [{
        nature: {
          type: 'request',
          quality: 'exec',
        },
      }],
    }],
  }, {
    name: 'Service',
    module: '../../cta-brick-request/samples/flowcontrol/service.js',
    dependencies: {},
    properties: {
      apiURL: 'http://localhost:9000/api',
    },
    publish: [{
      topic: 'requests.com',
      data: [{
        nature: {
          type: 'request',
          quality: 'exec',
        },
      }],
    }],
  }],
};