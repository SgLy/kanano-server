import * as Koa from 'koa'
const app = new Koa();

import * as bodyParser from 'koa-bodyparser';
app.use(bodyParser());

import * as route from 'koa-route';

import { ComposedMiddleware } from 'koa-compose';

const logger: ComposedMiddleware<Koa.Context> = async (ctx, next) => {
  if (next !== undefined) await next();
  console.log(`${ctx.method} ${ctx.url} - ${(new Date().toString())}`);
};
app.use(logger);

import { Parser } from './parser';
const parser = new Parser();

const PORT = 3000;

(async () => {
  await parser.init();

  app.use(route.post('/api/parse', parser.route));
  
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
})();

