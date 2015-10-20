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
server.route({
  method: 'post',
  path: '/throw',
  handler: (request, reply) => {
    throw new Error('Broken!');
  }
});
server.route({
  method: 'post',
  path: '/reply',
  handler: (request, reply) => {
    reply(new Error('Broken!'));
  }
});
server.route({
  method: 'post',
  path: '/promise',
  handler: (request, reply) => {
    reply(Promise.reject(new Error('die')));
  }
});
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

  tape('thrown error', (test) => {
    test.plan(1);

    server.inject({
      method: 'post',
      url: '/throw',
      payload: '{}'
    }, (res) => {
      test.equals(res.statusCode, 400);
    });
  });

  tape('replied error', (test) => {
    test.plan(1);

    server.inject({
      method: 'post',
      url: '/reply',
      payload: '{}'
    }, (res) => {
      test.equals(res.statusCode, 400);
    });
  });

  tape('promise error', (test) => {
    test.plan(1);

    server.inject({
      method: 'post',
      url: '/promise',
      payload: '{}'
    }, (res) => {
      test.equals(res.statusCode, 400);
    });
  });
});

