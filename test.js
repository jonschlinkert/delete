/*!
 * delete <https://github.com/jonschlinkert/delete>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

/* deps:mocha */
require('should');
var fs = require('fs');
var del = require('./');
var Promise = require('bluebird');

describe('delete:', function () {
  describe('async:', function () {
    beforeEach(function (done) {
      fs.writeFile('a.txt', 'This is a test.', function (err) {
        if (err) return done(err);
        done();
      });
    });

    it('should delete files asynchronously.', function (done) {
      fs.exists('a.txt', function (exists) {
        exists.should.be.true;

        del('a.txt', function(err) {
          if (err) return done(err);
          fs.existsSync('a.txt').should.be.false;
          done();
        });
      });
    });

    it('should not delete the cwd:', function (done) {
      del('.', function(err) {
        if (err) err.message.should.equal('Whoooaaa there! If you\'re sure you want to do this, define `options.force` to delete the current working directory.');
        done();
      });
    });

    it('should not delete parent directories:', function (done) {
      del('../', function(err) {
        if (err) err.message.should.equal('Yikes!! Take care! `options.force` must be defined to delete files or folders outside the current working directory.');
        done();
      });
    });
  });

  describe('sync:', function () {
    it('should delete files synchronously.', function () {
      fs.writeFileSync('a.txt', 'This is a test.');
      fs.existsSync('a.txt').should.be.true;

      del.sync('a.txt');
      fs.existsSync('a.txt').should.be.false;
    });

    it('should not delete the current working directory.', function () {
      (function () {
        del.sync('.');
      }).should.throw('Whoooaaa there! If you\'re sure you want to do this, define `options.force` to delete the current working directory.');
    });

    it('should not delete parent directories.', function () {
      (function () {
        del.sync('../');
      }).should.throw('Yikes!! Take care! `options.force` must be defined to delete files or folders outside the current working directory.');
    });
  });

  describe('promise:', function () {
    beforeEach(function (done) {
      fs.writeFile('a.txt', 'This is a test.', function (err) {
        if (err) return done(err);
        done();
      });
    });

    afterEach(function (done) {
      fs.exists('a.txt', function (exists) {
        exists.should.be.false;
        done();
      });
    });

    it('should delete files with `del.promise`.', function (done) {
      fs.exists('a.txt', function (exists) {
        exists.should.be.true;
        del.promise('a.txt')
          .then(function () {
            fs.exists('a.txt', function (exists) {
              exists.should.be.false;
              done();
            });
          });
      });
    });
  });
});
