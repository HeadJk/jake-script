"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
const types_1 = require("./types");
function parser(tokens) {
    const program = { body: [] };
    let current = 0;
    const parseNumericLiteral = (token) => {
        current++;
        const props = { value: token.value };
        return { kind: types_1.NumericLiteralNode.kind, props };
    };
    const parseCallExpression = (token) => {
        const identifier = token;
        current++;
        if (tokens[current].kind !== types_1.TokenKind.OpenParenToken) {
            throw new SyntaxError('Identifier must be followed by a (');
        }
        current++;
        const argument = parse();
        if (tokens[current].kind !== types_1.TokenKind.CloseParenToken) {
            throw new SyntaxError('Call expressions must terminate with a )');
        }
        current++;
        const props = { identifier, argument };
        return { kind: types_1.CallExpressionNode.kind, props };
    };
    const parseBinaryExpression = (token, next) => {
        const left = parseNumericLiteral(token);
        const operator = next;
        current++;
        const right = parse();
        const props = { left, right, operator };
        return { kind: types_1.BinaryExpressionNode.kind, props };
    };
    const parse = () => {
        const token = tokens[current];
        if (token.kind === types_1.TokenKind.IdentifierToken) {
            return parseCallExpression(token);
        }
        if (token.kind == types_1.TokenKind.NumericLiteralToken) {
            const next = tokens[current + 1];
            if (next.kind === types_1.TokenKind.PlusToken || next.kind === types_1.TokenKind.MinusToken ||
                next.kind === types_1.TokenKind.MultiplyToken || next.kind === types_1.TokenKind.DivideToken) {
                return parseBinaryExpression(token, next);
            }
            else {
                return parseNumericLiteral(token);
            }
        }
        throw new SyntaxError(`Unexpected token ${token}`);
    };
    while (current < tokens.length) {
        program.body.push(parse());
    }
    return program;
}
exports.parser = parser;
