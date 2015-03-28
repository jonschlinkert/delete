/*!
 * delete <https://github.com/jonschlinkert/delete>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var rimraf = require('rimraf');

module.exports = function (fp, options, next) {
  if (typeof options === 'function') {
    next = options; options = {};
  }
  fp = fp.split('\\').join('/');
  if (!(options && options.force)) {
    safeCheck(fp);
  }
  rimraf(fp, next);
};

module.exports.sync = function (fp, options) {
  if (!(options && options.force)) {
    safeCheck(fp);
  }
  fp = fp.split('\\').join('/');
  return rimraf.sync(fp);
};

function stripSlash(fp) {
  if (fp.substr(-1) === '/') {
    return fp.slice(0, -1);
  }
  return fp
}

function isCurrentDir(fp) {
  return process.cwd() === path.resolve(fp)
    || fp === './'
    || fp === '.';
}

function insideCurrentDir(fp) {
  var cwd = stripSlash(process.cwd());
  fp = stripSlash(path.resolve(fp));
  if (path.sep === '\\') {
    cwd = cwd.toLowerCase();
    fp = fp.toLowerCase();
  }
  return fp.substr(0, cwd.length) === cwd;
}

function safeCheck(fp) {
  var force = 'Can be overriden with the `force` option.';
  if (isCurrentDir(fp)) {
    throw new Error('Cannot delete the current working directory. ' + force);
  }
  if (!insideCurrentDir(fp)) {
    throw new Error('Cannot delete files/folders outside the current working directory. ' + force);
  }
}
