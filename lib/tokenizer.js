"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizer = void 0;
const types_1 = require("./types");
function tokenizer(input) {
    const NUMBERS = /[0-9]/;
    const LETTERS = /[a-zA-Z]/;
    const tokens = [];
    let cursorPos = 0;
    const readIn = () => input[cursorPos];
    const tokenize = (tokenizeCondition, tokenGenerator) => {
        if (tokenizeCondition) {
            tokens.push(tokenGenerator());
        }
        return tokenizeCondition;
    };
    const tokenizeWhiteSpace = () => {
        const condition = /\s/.test(readIn());
        if (condition) {
            cursorPos++;
        }
        return condition;
    };
    const tokenizeChar = (char, tokenKind) => tokenize(char === readIn(), () => { cursorPos++; return { kind: tokenKind }; });
    const tokenizeGroup = (checkIsPartOfGroup, tokenKind) => tokenize(checkIsPartOfGroup(readIn()), () => {
        let value = "";
        let char = readIn();
        while (checkIsPartOfGroup(char)) {
            value += char;
            cursorPos++;
            char = readIn();
            ;
        }
        return { kind: tokenKind, value };
    });
    const tokenizeGroupRegExp = (regExp, tokenKind) => tokenizeGroup((char) => regExp.test(char), tokenKind);
    while (cursorPos < input.length) {
        let isFailedTokenize = false;
        tokenizeWhiteSpace() ||
            tokenizeChar('(', types_1.TokenKind.OpenParenToken) ||
            tokenizeChar(')', types_1.TokenKind.CloseParenToken) ||
            tokenizeChar('+', types_1.TokenKind.PlusToken) ||
            tokenizeChar('-', types_1.TokenKind.MinusToken) ||
            tokenizeChar('*', types_1.TokenKind.MultiplyToken) ||
            tokenizeChar('/', types_1.TokenKind.DivideToken) ||
            tokenizeGroupRegExp(NUMBERS, types_1.TokenKind.NumericLiteralToken) ||
            tokenizeGroupRegExp(LETTERS, types_1.TokenKind.IdentifierToken) ||
            (isFailedTokenize = true);
        if (isFailedTokenize)
            throw new SyntaxError(`Unexpected token: "${readIn()}"`);
    }
    return tokens;
}
exports.tokenizer = tokenizer;
