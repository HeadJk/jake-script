"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpreter = exports.compiler = void 0;
const parser_1 = require("./parser");
const emitter_1 = require("./emitter");
const tokenizer_1 = require("./tokenizer");
function compiler(input) {
    const token = (0, tokenizer_1.tokenizer)(input);
    const ast = (0, parser_1.parser)(token);
    const output = (0, emitter_1.emitter)(ast);
    return output;
}
exports.compiler = compiler;
function interpreter(code) {
    return eval(code);
}
exports.interpreter = interpreter;
