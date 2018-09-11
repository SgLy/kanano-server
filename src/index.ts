import * as Koa from 'koa'
import * as route from 'koa-route';
import * as bodyParser from 'koa-bodyparser';

import * as Kuroshiro from 'kuroshiro';
import * as KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import { ComposedMiddleware } from 'koa-compose';

const app = new Koa();
app.use(bodyParser());

const logger: ComposedMiddleware<Koa.Context> = async (ctx, next) => {
  if (next !== undefined) await next();
  console.log(`${ctx.method} ${ctx.url} - ${(new Date().toString())}`);
};
app.use(logger);

const PORT = 3000;

const kuroshiro = new Kuroshiro();
const analyzer = new KuromojiAnalyzer();
const translater: ComposedMiddleware<Koa.Context> = async (ctx, next) => {
  if (next !== undefined) await next();
  const data = ctx.request.body || { text: '' };
  const text = data['text'];

  // tokenize first
  const tokens = await analyzer.parse(text);;

  ctx.response.type = 'json';
  ctx.response.body = { res: tokens };
}

(async () => {
  await kuroshiro.init(analyzer);

  app.use(route.post('/api/translate', translater));
  
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
})();

