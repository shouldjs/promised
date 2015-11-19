require('../');

var Promise = require('bluebird');

function promised(value) {
  return new Promise(function(resolve, reject) {
    resolve(value);
  });
}

function promiseFail() {
  return new Promise(function(resolve, reject) {
    reject(new Error('boom'));
  });
}


it('should return new assertion to hold promise', function() {
  var a = promised('abc').should.finally;
  return a.then.should.be.a.Function();
});

it('should determine if it is Promise', function() {
  promised('a').should.be.a.Promise();
});

it('should allow to chain calls like with usual assertion', function() {
  return promised('abc').should.finally.be.exactly('abc')
    .and.be.a.String();
});

it('should allow to use .not and .any', function() {
  return promised({a: 10, b: 'abc'}).should.finally.not.have.any.of.properties('c', 'd')
    .and.have.property('a', 10);
});

it('should treat assertion like promise', function() {
  return Promise.all([
    promised(10).should.finally.be.a.Number(),
    promised('abc').should.finally.be.a.String(),
  ]);
});

it('should propagate .not before .finally', function() {
  return promised(10).should.not.finally.be.a.String();
});

it('should be possible to use .eventually as an alias for .finally', function() {
  return promised(10).should.eventually.be.a.Number();
});

it('should allow to check if promise fulfilled', function() {
  return Promise.all([
    promised(10).should.be.fulfilled(), //positive
    promiseFail().should.be.fulfilled().then(function(value) {//negative
      should.fail();
    }, function(err) {
      err.should.be.Error().and.match({message: 'expected [Promise] to be fulfilled'});
    }),
    promised(10).should.not.be.fulfilled().then(function(value) {//positive fail
      should.fail();
    }, function(err) {
      err.should.be.Error().and.match({message: 'expected [Promise] not to be fulfilled'});
    }),
    promiseFail().should.not.be.fulfilled()//negative fail
  ]);
});

it('should be allow to check if promise is fulfilledWith a value', function() {
  return Promise.all([
    promised(10).should.be.fulfilledWith(10), //positive
    promiseFail().should.be.fulfilledWith(10).then(function(value) {//negative
      should.fail();
    }, function(err) {
      err.should.be.Error().and.match({message: 'expected [Promise] to be fulfilled'});
    }),
    promised(10).should.not.be.fulfilledWith(10).then(function(value) {//positive fail
      should.fail();
    }, function(err) {
      err.should.be.Error().and.match({message: 'expected [Promise] not to be fulfilled'});
    }),
    promiseFail().should.not.be.fulfilledWith(10)//negative fail
  ]);
});

it('should be allow to check if promise rejected', function() {
  return Promise.all([
    promiseFail().should.be.rejected(), //positive
    promised(10).should.be.rejected().then(function(value) {//negative
      should.fail();
    }, function(err) {
      err.should.be.Error().and.match({message: 'expected [Promise] to be rejected'});
    }),
    promiseFail().should.not.be.rejected().then(function(value) {//positive fail
      should.fail();
    }, function(err) {
      err.should.be.Error().and.match({message: 'expected [Promise] not to be rejected'});
    }),
    promised(10).should.not.be.rejected()//negative fail
  ]);
});

it('should allow to match rejected error', function() {
  return Promise.all([
    promiseFail().should.be.rejectedWith(Error),
    promiseFail().should.be.rejectedWith('boom'),
    promiseFail().should.be.rejectedWith('boom1').then(function() {
      return should.fail();
    }, function(err) {
      return err.should.be.Error().and.match({ message: 'expected [Promise] to be rejected with a message matching \'boom1\', but got \'boom\''});
    }),
    promiseFail().should.be.rejectedWith(/boom/),
    promiseFail().should.be.rejectedWith(Error, { message: 'boom' }),
    promiseFail().should.be.rejectedWith({ message: 'boom' }),
    promiseFail().should.not.be.rejectedWith().then(function(value) {//positive fail
      return should.fail();
    }, function(err) {
      return err.should.be.Error().and.match({message: 'expected [Promise] not to be rejected'});
    }),
    promised(10).should.be.rejectedWith().then(function(value) {//negative fail
      return should.fail();
    }, function(err) {
      return err.should.be.Error().and.match({message: 'expected [Promise] to be rejected'});
    }),
    promiseFail().should.not.be.rejectedWith(Error).then(function(value) {//negative fail
      return should.fail();
    }, function(err) {
      return err.should.be.Error().and.match({message: 'expected [Promise] not to be rejected'});
    }),
  ]);
});
