import * as Kuroshiro from 'kuroshiro';
import * as KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

import { Context } from 'koa';

export class Parser {
  private kuroshiro: any;
  private analyzer: any;

  constructor() {
    this.kuroshiro = new Kuroshiro();
    this.analyzer = new KuromojiAnalyzer();
    this.route = this.route.bind(this);
  }

  async init() {
    await this.kuroshiro.init(this.analyzer)
  }

  async route(ctx: Context, next: () => Promise<any>) {
    if (next !== undefined) await next();
    const data = ctx.request.body || { text: '' };
    const text = data['text'];

    // tokenize first
    const tokens = await this.analyzer.parse(text);

    // get needed infos
    const res = tokens.map(token => {
      const hasKanji = Kuroshiro.Util.hasKanji(token.surface_form);
      return {
        surface_form: token.surface_form,
        basic_form: token.basic_form,
        POS: {
          main: token.pos,
          detail: [token.pos_detail_1, token.pos_detail_2, token.pos_detail_3],
        },
        hasKanji,
        reading: hasKanji ? Kuroshiro.Util.kanaToHiragna(token.reading): undefined,
        pronunciation: hasKanji ? Kuroshiro.Util.kanaToHiragna(token.pronunciation) : undefined,
      };
    });

    ctx.response.type = 'json';
    ctx.response.body = { res };
  }
}