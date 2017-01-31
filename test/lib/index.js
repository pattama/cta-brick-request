'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const Lib = require('../../lib');
const request = new (require('cta-tool-request'))();
const cementHelper = {
  constructor: {
    name: 'CementHelper',
  },
  dependencies: {},
  createContext: function() {
    return {
      publish: function() {
      },
    };
  },
};
const Context = require('events').EventEmitter;
const test = {
  lib: null,
  response: {
    status: 200,
    type: 'application/json',
    data: {result: 'ok'},
    headers: {},
  },
  exec: null,
};

describe('tests', () => {
  context('instantiation', () => {
    it('throw if missing request dependency', (done) => {
      try {
        test.lib = new Lib(cementHelper, {
          name: 'cta-brick-request',
          properties: {},
        });
        done('should not be here');
      } catch (err) {
        // console.log(err);
        done();
      }
    });
    it('accept if provided request dependency', (done) => {
      try {
        cementHelper.dependencies.request = request;
        test.lib = new Lib(cementHelper, {
          name: 'cta-brick-request',
          properties: {},
        });
        test.exec = sinon.stub(test.lib.request, 'exec', () => {
          return Promise.resolve(test.response);
        });
        assert.property(test.lib, 'request');
        done();
      } catch (err) {
        // console.error(err);
        done('should not be here');
      }
    });
  });

  context('process', () => {
    it('process with exec', (done) => {
      const payload = {
        method: 'GET',
        url: 'http://localhost',
      };
      const context = new Context();
      context.data = {
        nature: {
          type: 'request',
          quality: 'exec',
        },
        payload: payload,
      };
      test.lib.process(context);
      sinon.assert.calledWith(test.exec, payload);
      context.on('done', function(name, result) {
        assert.strictEqual(name, 'cta-brick-request');
        assert.deepEqual(result, test.response);
        done();
      });
    });
    it('process with get', (done) => {
      const payload = {
        method: 'GET',
        url: 'http://localhost',
      };
      const context = new Context();
      context.data = {
        nature: {
          type: 'request',
          quality: 'get',
        },
        payload: payload,
      };
      test.lib.process(context);
      sinon.assert.calledWith(test.exec, payload);
      context.on('done', function(name, result) {
        assert.strictEqual(name, 'cta-brick-request');
        assert.deepEqual(result, test.response);
        done();
      });
    });
    it('process with error', (done) => {
      const payload = {
        method: 'GET',
        url: 'http://localhost',
      };
      const context = new Context();
      context.data = {
        nature: {
          type: 'request',
          quality: 'get',
        },
        payload: payload,
      };
      test.exec.restore();
      test.exec = sinon.stub(test.lib.request, 'exec', function() {
        throw new Error('exec error');
      });
      test.lib.process(context);
      sinon.assert.calledWith(test.exec, payload);
      context.on('error', function(name, err) {
        assert.strictEqual(name, 'cta-brick-request');
        assert.strictEqual(err.message, 'exec error');
        done();
      });
    });
  });
});
