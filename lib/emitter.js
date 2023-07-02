"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitter = void 0;
const types_1 = require("./types");
function emitter(program) {
    const emit = (node) => {
        switch (node.kind) {
            case types_1.NodeKind.NumericLiteralNode: return emitNumericLiteral(node);
            case types_1.NodeKind.BinaryExpressionNode: return emitBinaryExpression(node);
            case types_1.NodeKind.CallExpressionNode: return emitCallExpression(node);
            default: throw new SyntaxError("Unknown node");
        }
    };
    const emitNumericLiteral = (node) => node.value;
    const emitBinaryExpression = (node) => {
        let operator = "";
        switch (node.operator.kind) {
            case types_1.TokenKind.PlusToken:
                operator = "+";
                break;
            case types_1.TokenKind.MinusToken:
                operator = "-";
                break;
            case types_1.TokenKind.MultiplyToken:
                operator = "*";
                break;
            case types_1.TokenKind.DivideToken:
                operator = "/";
                break;
        }
        return `${emit(node.left)} ${operator} ${emit(node.right)}`;
    };
    const emitCallExpression = (node) => {
        if (node.identifier.value === 'debugJS') {
            return `console.log(${`'${emit(node.argument)}'`})`;
        }
        else if (node.identifier.value === 'log') {
            return `console.log(${emit(node.argument)})`;
        }
        else {
            throw new SyntaxError(`Unknown Identifier in call expression: ${node.identifier.value}`);
        }
    };
    const output = [];
    for (const node of program.body) {
        output.push(emit(node));
    }
    return output.join('\n');
}
exports.emitter = emitter;
