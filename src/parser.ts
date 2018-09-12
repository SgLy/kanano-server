import * as Kuroshiro from 'kuroshiro';
import * as KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

import { Context } from 'koa';

export class Parser {
  private kuroshiro: any;
  private analyzer: any;

  constructor() {
    this.kuroshiro = new Kuroshiro();
    this.analyzer = new KuromojiAnalyzer();
  }

  async init() {
    await this.kuroshiro.init(this.analyzer)
  }

  async route(ctx: Context, next: () => Promise<any>) {
    if (next !== undefined) await next();
    const data = ctx.request.body || { text: '' };
    const text = data['text'];

    // tokenize first
    const tokens = await this.analyzer.parse(text);;

    ctx.response.type = 'json';
    ctx.response.body = { res: tokens };
  }
}