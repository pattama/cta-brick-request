'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const Lib = require('../lib');
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

describe('tests', () => {
  let lib;
  context('instantiation', () => {
    it('throw if missing request dependency', (done) => {
      try {
        lib = new Lib(cementHelper, {
          name: 'cta-brick-request',
          properties: {},
        });
        done('should not be here');
      } catch (err) {
        console.log(err);
        done();
      }
    });
    it('accept if provided request dependency', (done) => {
      try {
        cementHelper.dependencies.request = request;
        lib = new Lib(cementHelper, {
          name: 'cta-brick-request',
          properties: {},
        });
        assert.property(lib, 'request');
        done();
      } catch (err) {
        console.error(err);
        done('should not be here');
      }
    });
  });
  context('main contracts', () => {
    it('exec', (done) => {
      const params = {
        method: 'GET',
        url: 'http://localhost',
      };
      const response = {
        status: 200,
        type: 'application/json',
        data: {result: 'ok'},
        headers: {},
      };
      const context = new Context();
      context.data = {
        nature: {
          type: 'request',
          quality: 'exec',
        },
        payload: params,
      };
      const _exec = sinon.stub(lib.request, 'exec', (p) => {
        console.log('exec params: ', p);
        return Promise.resolve(response);
      });
      lib.process(context);
      _exec.restore();
      sinon.assert.calledWith(_exec, params);
      context.on('done', function(name, result) {
        assert.strictEqual(name, 'cta-brick-request');
        assert.deepEqual(result, response);
        done();
      });
    });
  });
});
