should-promised
===============

There some helpers for asserting promises.

## .finally

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