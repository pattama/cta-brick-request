/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

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
   * Process the context
   * @param {Context} context - a Context
   */
  process(context) {
    const o = {
      type: context.data.nature.type,
      quality: context.data.nature.quality,
      payload: context.data.payload,
    };
    const that = this;
    return co(function* processCoroutine() {
      if (o.type === 'request') {
        if (['exec', 'get', 'post', 'put', 'delete', 'patch'].indexOf(o.quality) !== -1) {
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
