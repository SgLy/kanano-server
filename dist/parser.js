"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Kuroshiro = require("kuroshiro");
var KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
var Parser = /** @class */ (function () {
    function Parser() {
        this.kuroshiro = new Kuroshiro();
        this.analyzer = new KuromojiAnalyzer();
        this.route = this.route.bind(this);
    }
    Parser.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.kuroshiro.init(this.analyzer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parse = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.analyzer.parse(text)];
                    case 1:
                        tokens = _a.sent();
                        // get needed infos
                        return [2 /*return*/, tokens.map(function (token) {
                                var hasKanji = Kuroshiro.Util.hasKanji(token.surface_form);
                                return {
                                    surface_form: token.surface_form,
                                    basic_form: token.basic_form,
                                    POS: {
                                        main: token.pos,
                                        detail: [token.pos_detail_1, token.pos_detail_2, token.pos_detail_3],
                                    },
                                    hasKanji: hasKanji,
                                    reading: hasKanji && token && token.reading ? Kuroshiro.Util.kanaToHiragna(token.reading) : undefined,
                                    pronunciation: hasKanji && token && token.pronunciation ? Kuroshiro.Util.kanaToHiragna(token.pronunciation) : undefined,
                                };
                            })];
                }
            });
        });
    };
    Parser.prototype.route = function (ctx, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, text, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(next !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, next()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        data = ctx.request.body || { text: '' };
                        text = data['text'];
                        return [4 /*yield*/, Promise.all(text.split('\n').map(function (t) { return _this.parse(t); }))];
                    case 3:
                        res = _a.sent();
                        ctx.response.type = 'json';
                        ctx.response.body = { res: res };
                        return [2 /*return*/];
                }
            });
        });
    };
    return Parser;
}());
exports.Parser = Parser;
