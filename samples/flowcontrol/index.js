'use strict';

const mock = require('./server.mock');
const FlowControl = require('cta-flowcontrol');
const Cement = FlowControl.Cement;
const config = require('./config');
const cement = new Cement(config);
