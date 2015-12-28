/*!
 * delete <https://github.com/jonschlinkert/delete>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var utils = require('./lib/utils');

function del(patterns, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var opts = utils.extend({cwd: process.cwd()}, options);

  utils.glob(patterns, opts, function(err, files) {
    utils.async.each(files, function(file, next) {
      var fp = path.resolve(opts.cwd, file);

      try {
        assertDirectory(fp, opts);
      } catch (err) {
        next(err);
        return;
      }
      utils.rimraf(fp, next);
    }, cb);
  });
}

del.sync = function delSync(patterns, options) {
  var opts = utils.extend({cwd: process.cwd()}, options);
  try {
    utils.glob.sync(patterns, opts).forEach(function(file) {
      var fp = path.resolve(opts.cwd, file);
      assertDirectory(fp, opts);
      utils.rimraf.sync(fp);
    });
  } catch (err) {
    throw err;
  }
};

del.promise = function delPromise(patterns, options) {
  var Promise = utils.promise;
  var opts = utils.extend({cwd: process.cwd()}, options);

  return utils.glob.promise(patterns, opts)
    .then(function(files) {
      files.forEach(function(fp) {
        del.sync(fp, opts);
      });
    })
    .catch(function(err) {
      throw err;
    });
};

function assertDirectory(fp, options) {
  options = options || {};

  if (options && options.force) {
    return;
  }

  if (utils.isCurrentDir(fp) === true) {
    throw new Error('Whoooaaa there! If you\'re sure you want to do this, define `options.force` to delete the current working directory.');
  }

  if (utils.insideCurrentDir(fp) === false) {
    throw new Error('Yikes!! Take care! `options.force` must be defined to delete files or folders outside the current working directory.');
  }
}

/**
 * Expose `del`
 */

module.exports = del;
