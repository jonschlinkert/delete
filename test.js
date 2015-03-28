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

describe('delete:', function () {
  beforeEach(function (cb) {
    fs.writeFile('a.txt', 'This is a test.', function (err) {
      if (err) console.log(err);
      cb();
    });
  });

  describe('async:', function () {
    it('should delete files asynchronously.', function (cb) {
      fs.existsSync('a.txt').should.be.true;

      del('a.txt', function(err) {
        if (err) console.log(err);
        fs.existsSync('a.txt').should.be.false;
        cb();
      });
    });
  });

  describe('sync:', function () {
    it('should delete files synchronously.', function () {
      var fixture = 'a.txt';
      fs.existsSync(fixture).should.be.true;

      del.sync('a.txt');
      fs.existsSync(fixture).should.be.false;
    });
  });
});
