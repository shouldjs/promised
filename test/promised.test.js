require('../');

var Promise = require('bluebird');

function promised(value) {
  return new Promise(function(resolve, reject) {
    resolve(value);
  })
}

describe('Should - Promised', function() {
  describe('.finally', function() {
    it('should return new assertion to hold promise', function() {
      var a = promised('abc').should.finally;
      return a.then.should.be.a.Function;
    });


  });

  it('should allow to chain calls like with usual assertion', function() {
    return promised('abc').should.finally.be.exactly('abc')
      .and.be.a.String;
  });

  it('should allow to use .not and .any', function() {
    return promised({ a: 10, b: 'abc' }).should.finally.not.have.any.of.properties('c', 'd')
      .and.have.property('a', 10);
  });

  it('should treat assertion like promise', function() {
    return Promise.all([
      promised(10).should.finally.be.a.Number,
      promised('abc').should.finally.be.a.String
    ])
  })

  it('should fail as usual', function() {
    //return promised('abc').should.finally.not.be.String;
  })
});