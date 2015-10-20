'use strict';

let tape = require('tape');
let hapi = require('hapi');
let drboom = require('../index');
let Boom = require('boom');

let drboomTest1 = {
  detect: (request, reply) => {
    return false;
  },
  handle: (request, reply) => {
    return;
  }
};

let drboomTest2 = {
  detect: (request, reply) => {
    return true;
  },
  handle: (request, reply) => {
    return Boom.badRequest();
  }
};

let server = new hapi.Server();
server.connection();
server.register([
  {
    register: drboom,
    options: {
      plugins: [drboomTest1, drboomTest2]
    }
  }
], (err) => {
  tape('basic test', (test) => {
    test.plan(1);

    server.inject({
      method: 'post',
      url: '/',
      payload: '{}'
    }, (res) => {
      test.equals(res.statusCode, 400)
    });
  });
});

