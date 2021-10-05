#!/usr/bin/env node

'use strict';

const path = require('path');
const mri = require('mri');
const devcert = require('devcert');

const arg = mri(process.argv.slice(2));
const [dir = '.'] = arg['_'];
const https = arg.https;
const scheme = https ? 'https' : 'http';
const hostname = arg.host || 'localhost';
const port = arg.port || 3000;

async function main() {
  let baseUrl = `${scheme}://${hostname}:${port}`;
  if ((https && port == 443) || (!https && port == 80)) {
    baseUrl = `${scheme}://${hostname}`;
  }

  const ssl = arg.https && await devcert.certificateFor(hostname);
  const fastify = require('fastify')({
    logger: true,
    ...ssl && {
      http2: true,
      https: {
        allowHTTP1: true,
        key: ssl.key,
        cert: ssl.cert,
      },
    },
  });

  fastify.get('/___coep_report', (request, reply) => {
    request.log.info({ report: request.body });
    reply.code(204).send();
  });

  fastify.get('/___coop_report', (request, reply) => {
    request.log.info({ report: request.body });
    reply.code(204).send();
  });

  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, dir),
    setHeaders(res) {
      res.setHeader(
        'Report-To',
        `{ group: "coep_report", max_age: 86400, endpoints: [{ url: "${baseUrl}/___coep_report" }] }, { group: "coop_report", max_age: 86400, endpoints: [{ url: "${baseUrl}/___coop_report" }] }`,
      );
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp; report-to="coep_report"');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin; report-to="coop_report"');
    },
  });

  fastify.listen(port, hostname);
}

main().catch(err => void(console.error(err) && process.exit(1)));
