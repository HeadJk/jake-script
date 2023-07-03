"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallExpressionNode = exports.BinaryExpressionNode = exports.NumericLiteralNode = exports.NodeKind = void 0;
const tokens_1 = require("./tokens");
var NodeKind;
(function (NodeKind) {
    NodeKind["NumericLiteralNode"] = "NumericLiteralNode";
    NodeKind["CallExpressionNode"] = "CallExpressionNode";
    NodeKind["BinaryExpressionNode"] = "BinaryExpressionNode";
})(NodeKind = exports.NodeKind || (exports.NodeKind = {}));
;
class NumericLiteralNode {
    constructor(value) {
        this.value = value;
    }
    emit() {
        return this.value;
    }
}
exports.NumericLiteralNode = NumericLiteralNode;
class BinaryExpressionNode {
    constructor(left, right, operator) {
        this.left = left;
        this.right = right;
        this.operator = operator;
    }
    emit() {
        let operator = "";
        switch (this.operator.kind) {
            case tokens_1.TokenKind.PlusToken:
                operator = "+";
                break;
            case tokens_1.TokenKind.MinusToken:
                operator = "-";
                break;
            case tokens_1.TokenKind.MultiplyToken:
                operator = "*";
                break;
            case tokens_1.TokenKind.DivideToken:
                operator = "/";
                break;
        }
        return `${this.left.emit()} ${operator} ${this.right.emit()}`;
    }
}
exports.BinaryExpressionNode = BinaryExpressionNode;
class CallExpressionNode {
    constructor(identifier, argument) {
        this.identifier = identifier;
        this.argument = argument;
    }
    emit() {
        if (this.identifier.value === 'debugJS') {
            return `console.log(${`'${this.argument.emit()}'`})`;
        }
        else if (this.identifier.value === 'log') {
            return `console.log(${this.argument.emit()})`;
        }
        else {
            throw new SyntaxError(`Unknown Identifier in call expression: ${this.identifier.value}`);
        }
    }
}
exports.CallExpressionNode = CallExpressionNode;
