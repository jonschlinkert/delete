'use strict';

/*!
 * delete <https://github.com/jonschlinkert/delete>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var del = require('./');

function writeFixtures(names) {
  if (typeof names === 'string') names = [names];
  for (var i = 0; i < names.length; i++) {
    fs.writeFileSync(names[i], 'fixture');
  }
}
function exists(names) {
  for (var i = 0; i < names.length; i++) {
    if (!fs.existsSync(names[i])) {
      return false;
    }
  }
  return true;
}

describe('delete:', function() {
  afterEach(function() {
    assert(!exists(['a.txt', 'b.txt', 'c.txt']));
  });

  describe('async:', function() {
    it('should do nothing when pattern is empty and no cwd is passed', function(cb) {
      del('', function(err, files) {
        assert.equal(files.length, 0);
        cb();
      });
    });

    it('should not delete the cwd:', function(cb) {
      del('.', function(err, files) {
        assert(err);
        assert.equal(files.length, 0);
        assert(/force/.test(err.message));
        cb();
      });
    });

    it('should not delete parent directories:', function(cb) {
      del('../', function(err, files) {
        assert(err);
        assert.equal(files.length, 0);
        assert(/force/.test(err.message));
        cb();
      });
    });

    it('should delete a file', function(cb) {
      writeFixtures('a.txt');
      del('a.txt', function(err, files) {
        assert.ifError(err);
        assert.equal(files.length, 1);
        cb();
      });
    });

    it('should delete an array of files', function(cb) {
      writeFixtures(['a.txt', 'b.txt']);
      assert(exists(['a.txt', 'b.txt']));

      del(['a.txt', 'b.txt'], cb);
    });

    it('should add deleted files to callback', function(cb) {
      writeFixtures(['a.txt', 'b.txt']);
      assert(exists(['a.txt', 'b.txt']));

      del(['a.txt', 'b.txt'], function(err, files) {
        assert.ifError(err);
        assert.equal(files[0], path.resolve('a.txt'));
        assert.equal(files[1], path.resolve('b.txt'));
        cb();
      });
    });

    it('should not add files that did not exist', function(cb) {
      writeFixtures(['a.txt', 'b.txt']);
      assert(exists(['a.txt', 'b.txt']));

      del(['a.txt', 'b.txt', 'c.txt'], function(err, files) {
        assert.ifError(err);
        assert.equal(files.length, 2);
        assert.equal(files[0], path.resolve('a.txt'));
        assert.equal(files[1], path.resolve('b.txt'));
        cb();
      });
    });

    it('should delete a glob of files asynchronously', function(cb) {
      writeFixtures(['a.txt', 'b.txt', 'c.txt']);
      assert(exists(['a.txt', 'b.txt', 'c.txt']));

      del(['*.txt'], function(err) {
        assert.ifError(err);
        assert(!fs.existsSync('a.txt'));
        cb();
      });
    });
  });

  describe('sync:', function() {
    it('should not delete the current working directory', function() {
      assert.throws(function() {
        del.sync('.');
      });
    });

    it('should not delete parent directories', function() {
      assert.throws(function() {
        del.sync('../');
      });
    });

    it('should delete files synchronously', function() {
      writeFixtures(['a.txt']);
      assert(exists(['a.txt']));
      del.sync('a.txt');
    });

    it('should delete a glob of files synchronously', function() {
      writeFixtures(['a.txt', 'b.txt', 'c.txt']);
      assert(exists(['a.txt', 'b.txt', 'c.txt']));
      del.sync(['*.txt']);
    });

    it('should return an array of deleted files', function() {
      writeFixtures(['a.txt', 'b.txt', 'c.txt']);
      assert(exists(['a.txt', 'b.txt', 'c.txt']));
      var deleted = del.sync(['*.txt']);
      assert.equal(deleted.length, 3);
    });
  });

  describe('promise:', function() {
    it('should do nothing when pattern is an empty string', function() {
      return del('')
        .then(function(files) {
          assert.equal(files.length, 0);
        });
    });

    it('should delete files with `del.promise`', function() {
      writeFixtures(['a.txt']);
      assert(exists(['a.txt']));
      return del.promise('a.txt');
    });

    it('should delete a glob of files with `del.promise`', function() {
      writeFixtures(['a.txt', 'b.txt', 'c.txt']);
      assert(exists(['a.txt', 'b.txt', 'c.txt']));
      return del.promise(['*.txt']);
    });

    it('should return list of deleted files', function() {
      writeFixtures(['a.txt', 'b.txt', 'c.txt']);
      assert(exists(['a.txt', 'b.txt', 'c.txt']));
      return del(['*.txt'])
        .then(function(files) {
          assert.equal(files.length, 3);
        })
    });

    it('should use the promise method when no callback is given', function() {
      writeFixtures(['a.txt', 'b.txt', 'c.txt']);
      assert(exists(['a.txt', 'b.txt', 'c.txt']));
      return del(['*.txt']);
    });
  });
});
