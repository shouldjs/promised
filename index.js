var should = require('should');
var util = require('should/lib/util');

/**
 * Assert given object is a Promise
 *
 * @name Promise
 * @memberOf Assertion
 * @category assertion promises
 * @module should-promised
 * @example
 *
 * promise.should.be.Promise;
 * (new Promise(function(resolve, reject) { resolve(10); })).should.be.a.Promise;
 * (10).should.not.be.a.Promise;
 */
should.Assertion.add('Promise', function() {
  this.params = {operator: 'to be promise'};

  this.have.property('then')
    .which.is.a.Function
    .and.have.property('length')
    .which.is.above(1);
}, true);

/**
 * Assert given promise will be fulfilled
 *
 * @name fulfilled
 * @memberOf Assertion
 * @category assertion promises
 * @module should-promised
 * @returns {Promise}
 * @example
 * (new Promise(function(resolve, reject) { resolve(10); })).should.be.fulfilled;
 */
Object.defineProperty(should.Assertion.prototype, 'fulfilled', {
  get: function Assertion$fulfilled() {
    this.params = {operator: 'to be fulfilled'};

    this.obj.should.be.a.Promise;

    var that = this;
    return this.obj.then(function(value) {
      if(that.negate) {
        that.fail();
      }
      return value;
    }, function next$onError(err) {
      if(!that.negate) {
        that.fail();
      }
      return err;
    })
  }
});

/**
 * Assert given promise will be rejected
 *
 * @name fulfilled
 * @memberOf Assertion
 * @category assertion promises
 * @module should-promised
 * @returns {Promise}
 * @example
 * (new Promise(function(resolve, reject) { resolve(10); })).should.not.be.rejected;
 */
Object.defineProperty(should.Assertion.prototype, 'rejected', {
  get: function() {
    this.params = {operator: 'to be rejected'};

    this.obj.should.be.a.Promise;

    var that = this;
    return this.obj.then(function(value) {
      if(!that.negate) {
        that.fail();
      }
      return value;
    }, function next$onError(err) {
      if(that.negate) {
        that.fail();
      }
      return err;
    })
  }
});

/**
 * Assert given object is promise and wrap it in PromisedAssertion, which has all properties of should.Assertion. That means you can chain as with usual Assertion.
 *
 * @name finally
 * @memberOf Assertion
 * @alias Assertion#eventually
 * @category assertion promises
 * @module should-promised
 * @returns {PromisedAssertion} Like should.Assertion, but .then this.obj in Assertion
 * @example
 *
 * (new Promise(function(resolve, reject) { resolve(10); })).should.be.eventually.equal(10);
 */
Object.defineProperty(should.Assertion.prototype, 'finally', {
  get: function() {
    this.obj.should.be.a.Promise;

    var that = this;

    return new PromisedAssertion(this.obj.then(function(obj) {
      var a = should(obj);

      a.negate = that.negate;
      a.anyOne = that.anyOne;

      return a;
    }));
  }
});

should.Assertion.alias('finally', 'eventually');

function PromisedAssertion(obj) {
  should.Assertion.apply(this, arguments);
}

function constructValueCall(name) {
  return function() {
    var args = arguments;
    this.obj = this.obj.then(function(a) {
      return a[name].apply(a, args);
    });

    return this;
  }
}

function constructGetCall(name) {
  return function() {
    this.obj = this.obj.then(function(a) {
      return a[name];
    });

    return this;
  }
}

var methodsBlacklist = {
  constructor: true,
  getMessage: true
};

for(var name in should.Assertion.prototype) {
  if(name in methodsBlacklist) continue;

  var desc = Object.getOwnPropertyDescriptor(should.Assertion.prototype, name);

  if(desc.get) {
    desc.get = constructGetCall(name);
  } else {
    desc.value = constructValueCall(name);
  }

  Object.defineProperty(PromisedAssertion.prototype, name, desc);
}

// delegate some methods of promises to internal promise
/**
 * Make PromisedAssertion to look like promise. Delegate resolve and reject to given promise.
 *
 * @name then
 * @memberOf PromisedAssertion
 * @category assertion promises
 * @module should-promised
 * @returns {Promise}
 */
PromisedAssertion.prototype.then = function(resolve, reject) {
  return this.obj.then(resolve, reject);
};