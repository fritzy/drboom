# Dr. Boom

[![npm i drboom](https://nodei.co/npm/drboom.png)](https://www.npmjs.com/package/drboom)

Dr. Boom detects errors being passed into Hapi's HTTP replies and converts them into the appropriate HTTP Error.

This allows you to pass the resulting error and result from a database query to reply without having to do special error handling.

## Example

For example, to detect Joi validation errors:

```javascript
let Hapi = require('hapi');
server.register([
  {
    register: require('drboom'),
    options: {
      plugins: [require('drboom-joi')({})]
    }
  }
], (err) => {
    // ...
});

```

Then when a route serves an a Joi validation result as the first argument, the reply is automatically converted to an HTTP 400 Bad Request error.

## Writing a Dr. Boom Plugin

A Dr. Boom plugin is an object with two functions, `detect` and `handle`.

__detect(response)__

Response is the first argument sent to reply.

return: Boolean, false meaning that you didn't detect an error your handler can deal with. 

__handle(response)__

Response is the first argument sent to reply.

return: Boom error
