"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const tokenizer_1 = require("./tokenizer");
test('it should pass', () => {
    expect((0, parser_1.parser)((0, tokenizer_1.tokenizer)('log(1+3)'))).toMatchSnapshot();
});
