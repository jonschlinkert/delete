'use strict';

var path = require('path');

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('extend-shallow', 'extend');
require('bluebird', 'promise');
require('matched', 'glob');
require('rimraf');
require('async');
require = fn;

/**
 * Utils
 */

utils.insideCurrentDir = function insideCurrentDir(fp) {
  var cwd = utils.stripSlash(process.cwd());
  fp = utils.stripSlash(path.resolve(fp));
  if (path.sep === '\\') {
    cwd = cwd.toLowerCase();
    fp = fp.toLowerCase();
  }
  return fp.substr(0, cwd.length) === cwd;
};

utils.stripSlash = function stripSlash(fp) {
  if (fp.substr(-1) === '/') {
    return fp.slice(0, -1);
  }
  return fp
};

utils.isCurrentDir = function isCurrentDir(fp) {
  if (process.cwd() === path.resolve(fp)) {
    return true;
  }
  return fp === './' || fp === '.';
};

/**
 * Expose `utils`
 */

module.exports = utils;
