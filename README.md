CTA-BRICK-REQUEST
=================

This is the Brick adapter of cta-tool-request, it allows making http requests over this tool in a flowcontrol application 

First refer to cta-brick and cta-flowcontrol repositories to familiarize yourself with those concepts.

Like all bricks, it can be easily injected into a flowcontrol application using a configuration

# Brick dependencies

This brick depends on cta-tool-request

# Brick properties

Currently none

# Brick contracts

| nature.type | nature.quality | payload sample
| --- | --- | ---
| request | exec | ````{ method: 'HEAD', url: 'http://some.domain.com' }````
| request | get | ````{ url: 'http://some.domain.com' }````
| request | post | ````{ url: 'http://some.domain.com', body: {id: 1, name: 'foo'}, headers: {'x-from': 'some service'} }````
| request | put | ````{ url: 'http://some.domain.com/1', body: { name: 'bar'} }````
| request | delete | ````{ url: 'http://some.domain.com/1', headers: {'token': 'dsqqp1lkjuldskfj2scfkswnhd9wfwjswjhn9g'} }````

# Configuration sample

````javascript
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
````

See a full working sample in /samples/flowcontrol/

