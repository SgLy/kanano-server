import * as Koa from 'koa'

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello world';
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});