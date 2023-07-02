"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("./tokenizer");
test('it should pass', () => {
    expect((0, tokenizer_1.tokenizer)('log(1+3+5)')).toMatchSnapshot();
});
