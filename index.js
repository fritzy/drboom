'use strict';

let Joi = require('joi');
let Boom = require('boom');

let internal = Joi.object({
    getNull404: Joi.boolean(),
    plugins: Joi.array()
});

exports.register = function (server, opts, next) {

  let regErr = internal.validate(opts);
  if (regErr.error) {
    throw regError;
  }

  server.ext('onPreResponse', (request, reply) => {

    let source = request.response;
    if (!(source instanceof Error)) {
      return reply.continue();
    }

    if (request.method == 'get' && source === null && opts.getNull404) {
      reply(Boom.notFound());
    } else {
      for (let plugin of opts.plugins) {
        let error;
        if (plugin.detect(source, request, reply)) {
          error = plugin.handle(source, request, reply);
        }
        if (typeof error !== 'undefined') {
          return reply(error);
        }
      }
    }

    reply.continue();

  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
