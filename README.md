should-promised
===============

There some helpers for asserting promises.

## .Promise

Assert given object is promise

## .fulfilled

Assert given promise will be fulfilled. It will return promise.

```
it('should be allow to check if promise fulfilled', function() {
  return promised(10).should.be.fulfilled;
});
```

## .fulfilledWith

Assert given promise will be fulfilled with an expected value. It will return promise.

```
it('should be allow to check if promise fulfilledWith an expected value', function() {
  return promised(10).should.be.fulfilledWith(10);
});
```

## .rejected

Assert given promise will be rejected. It will return promise.

```
it('should be allow to check if promise rejected', function() {
  return promiseFail().should.be.rejected;
});
```

## .rejectedWith

Assert given promise will be rejected with matched Error. Arguments are the same as Assertion\#throw.

## .finally or .eventually

This method begin assertions for promises, all next .chain calls will be shortcuts for .thenable calls on promise.

So you can do like this

```js
promised('abc').should.finally.be.exactly('abc')
      .and.be.a.String;

//or combine with any of Promise methods as any assertion will return Promise itself

Promise.all([
  promised(10).should.finally.be.a.Number,
  promised('abc').should.finally.be.a.String
])
```

## Before .finally

Everything you did before .finally saved into new assertion (but that is not quite usefull as object will be promise).
Main idea is to save `.not` and `.any`.