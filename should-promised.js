(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['should'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('should'));
  } else {
    factory(Should);
  }
}(function (should) {
  var util = should.util;

  /**
   * Assert given object is a Promise
   *
   * @name Promise
   * @memberOf Assertion
   * @category assertion promises
   * @module should-promised
   * @example
   *
   * promise.should.be.Promise();
   * (new Promise(function(resolve, reject) { resolve(10); })).should.be.a.Promise();
   * (10).should.not.be.a.Promise();
   */
  should.Assertion.add('Promise', function () {
    this.params = {operator: 'to be promise'};

    var obj = this.obj;

    should(obj).have.property('then')
      .which.is.a.Function();
  });

  /**
   * Assert given promise will be fulfilled
   *
   * @name fulfilled
   * @memberOf Assertion
   * @category assertion promises
   * @module should-promised
   * @returns {Promise}
   * @example
   * (new Promise(function(resolve, reject) { resolve(10); })).should.be.fulfilled();
   */
  should.Assertion.prototype.fulfilled = function Assertion$fulfilled() {
    this.params = {operator: 'to be fulfilled'};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function (value) {
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
  };

  /**
   * Assert given promise will be rejected
   *
   * @name rejected
   * @memberOf Assertion
   * @category assertion promises
   * @module should-promised
   * @returns {Promise}
   * @example
   * (new Promise(function(resolve, reject) { resolve(10); })).should.not.be.rejected();
   */
  should.Assertion.prototype.rejected = function () {
    this.params = {operator: 'to be rejected'};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function (value) {
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
  };

  /**
   * Assert given promise will be fulfilled with some expected value.
   *
   * @name fulfilledWith
   * @memberOf Assertion
   * @category assertion promises
   * @module should-promised
   * @returns {Promise}
   * @example
   * (new Promise(function(resolve, reject) { resolve(10); })).should.be.fulfilledWith(10);
   */
  should.Assertion.prototype.fulfilledWith = function(expectedValue) {
    this.params = {operator: 'to be fulfilled'};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function (value) {
      if(that.negate) {
        that.fail();
      }
      should(value).eql(expectedValue);
      return value;
    }, function next$onError(err) {
      if(!that.negate) {
        that.fail();
      }
      return err;
    });
  };

  /**
   * Assert given promise will be rejected with some sort of error. Arguments is the same for Assertion#throw
   *
   * @name rejectedWith
   * @memberOf Assertion
   * @category assertion promises
   * @module should-promised
   * @returns {Promise}
   * @example
   *
   * function failedPromise() {
 *   return new Promise(function(resolve, reject) {
 *     reject(new Error('boom'));
 *   })
 * }
   * failedPromise().should.be.rejectedWith(Error);
   * failedPromise().should.be.rejectedWith('boom');
   * failedPromise().should.be.rejectedWith(/boom/);
   * failedPromise().should.be.rejectedWith(Error, { message: 'boom' });
   * failedPromise().should.be.rejectedWith({ message: 'boom' });
   */
  should.Assertion.prototype.rejectedWith = function (message, properties) {
    this.params = {operator: 'to be rejected'};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function (value) {
      if(!that.negate) {
        that.fail();
      }
      return value;
    }, function next$onError(err) {
      if(that.negate) {
        that.fail();
      }

      var errorMatched = true, errorInfo = '';

      if('string' == typeof message) {
        errorMatched = message == err.message;
      } else if(message instanceof RegExp) {
        errorMatched = message.test(err.message);
      } else if('function' == typeof message) {
        errorMatched = err instanceof message;
      } else if(message != null && typeof message == 'object') {
        try {
          should(err).match(message);
        } catch(e) {
          if(e instanceof should.AssertionError) {
            errorInfo = ": " + e.message;
            errorMatched = false;
          } else {
            throw e;
          }
        }
      }

      if(!errorMatched) {
        if('string' == typeof message || message instanceof RegExp) {
          errorInfo = " with a message matching " + should.format(message) + ", but got '" + err.message + "'";
        } else if('function' == typeof message) {
          errorInfo = " of type " + util.functionName(message) + ", but got " + util.functionName(err.constructor);
        }
      } else if('function' == typeof message && properties) {
        try {
          should(err).match(properties);
        } catch(e) {
          if(e instanceof should.AssertionError) {
            errorInfo = ": " + e.message;
            errorMatched = false;
          } else {
            throw e;
          }
        }
      }

      that.params.operator += errorInfo;

      that.assert(errorMatched);

      return err;
    })
  };

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
    get: function () {
      should(this.obj).be.a.Promise();

      var that = this;

      return new PromisedAssertion(this.obj.then(function (obj) {
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
    return function () {
      var args = arguments;
      this.obj = this.obj.then(function (a) {
        return a[name].apply(a, args);
      });

      return this;
    }
  }

  function constructGetCall(name) {
    return function () {
      this.obj = this.obj.then(function (a) {
        return a[name];
      });

      return this;
    }
  }


  for(var name in should.Assertion.prototype) {

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
  PromisedAssertion.prototype.then = function (resolve, reject) {
    return this.obj.then(resolve, reject);
  };
}));
