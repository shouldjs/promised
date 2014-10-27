var should = require('should');
var util = require('should/lib/util');

Object.defineProperty(should.Assertion.prototype, 'finally', {
  get: function() {
    this.obj.then.should.be.a.Function;
    return new PromisedAssertion(this.obj.then(should));
  }
});

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
  getMessage: true,
  formattedObj: true
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
PromisedAssertion.prototype.then = function(resolve, reject) {
  return this.obj.then(resolve, reject);
};