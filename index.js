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

  server.ext('onPostHandler', (request, reply) => {

    if (request.method == 'get' && source.source === null && opts.getNull404) {
      throw Boom.notFound();
    } else {
      for (let plugin of opts.plugins) {
        let error;
        try {
          if (plugin.detect(request.response)) {
            error = plugin.handle(request.response);
          }
        } catch (e) {
          throw e;
        }
        if (typeof error !== 'undefined') {
          throw error;
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
