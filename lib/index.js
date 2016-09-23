'use strict';

const Brick = require('cta-brick');
const co = require('co');

class RequestBrick extends Brick {
  /**
   * constructor - Create a new Brick instance
   *
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {BrickConfig} config - cement configuration of the brick
   */
  constructor(cementHelper, config) {
    super(cementHelper, config);
    if (!('request' in cementHelper.dependencies)) {
      throw new Error('request dependency needed');
    }
    this.request = cementHelper.dependencies.request;
  }

  /**
   * Validates Context properties
   * @param {Context} context - a Context
   * @returns {Promise}
   */
  validate(context) {
    this.logger.debug('context:', context);
    return Promise.resolve();
  }

  /**
   * Process the context
   * @param {Context} context - a Context
   */
  process(context) {
    const o = super.process(context);
    const that = this;
    return co(function* processCoroutine() {
      if (o.type === 'request') {
        if (['exec', 'get', 'post', 'put', 'delete'].indexOf(o.quality) !== -1) {
          const params = o.payload;
          if (o.quality !== 'exec') {
            params.method = o.quality;
          }
          const result = yield that.request.exec(params);
          that.logger.debug(result);
          context.emit('done', that.name, result);
        }
      }
    }).catch((err) => {
      context.emit('reject', that.name, err);
      context.emit('error', that.name, err);
    });
  }
}

module.exports = RequestBrick;
