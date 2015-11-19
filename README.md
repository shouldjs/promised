should-promised
===============

Define some helpers for asserting promises.

## .Promise()

Assert that the given object is an instance of a Promise

## .fulfilled()

Assert that the given promise will be fulfilled. It will return a promise.

```javascript
it('should be allowed to check if promise fulfilled', function() {
  return promised(10).should.be.fulfilled();
});
```

## .fulfilledWith(value)

Assert that the given promise will be fulfilled with an expected value. It will return a promise.

```javascript
it('should be allow to check if promise fulfilledWith an expected value', function() {
  return promised(10).should.be.fulfilledWith(10);
});
```

## .rejected()

Assert that the given promise will be rejected. It will return a promise.

```
it('should be allow to check if promise rejected', function() {
  return promiseFail().should.be.rejected();
});
```

## .rejectedWith(Error)

Assert that the given promise will be rejected with the matched Error. Arguments are the same as Assertion\#throw.

## .finally or .eventually

This method begin assertions for promises, all next .chain calls will be shortcuts for .thenable calls on promise.

So you can do something like this

```js
promised('abc').should.finally.be.exactly('abc')
      .and.be.a.String();

//or combine with any of Promise methods as any assertion will return Promise itself

Promise.all([
  promised(10).should.finally.be.a.Number(),
  promised('abc').should.finally.be.a.String()
])
```

## Before .finally

Everything you did before .finally is saved into a new assertion (but that is
not quite as useful, as the object will be a promise). The main idea is to save
`.not` and `.any`.
