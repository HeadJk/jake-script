"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallExpressionNode = exports.BinaryExpressionNode = exports.NumericLiteralNode = exports.deserialize = exports.serialize = void 0;
const tokens_1 = require("./tokens");
// export interface Serializable {
//     toObject(): Object;
// }
// export abstract class Serializable implements Kind, Serializable, Props {
//     constructor() {
//     }
//     abstract kind(): string;
//     abstract props(): Object;
//     toObject() {
//         return {
//             kind: this.kind(),
//             props: { ...this.props() },
//         }
//     }
// }
function serialize(node) {
    return {
        kind: node.kind(),
        props: node.props(),
    };
}
exports.serialize = serialize;
function deserialize(serializedNode) {
    const { kind, props } = serializedNode;
    switch (kind) {
        case "NumericLiteralNode": return new NumericLiteralNode(props);
        case "BinaryExpressionNode": return new BinaryExpressionNode(props);
        case "CallExpressionNode": return new CallExpressionNode(props);
    }
}
exports.deserialize = deserialize;
class NumericLiteralNode {
    constructor(properties) {
        this.properties = properties;
    }
    // static checkThenConstruct(maybeProps: unknown) {
    //     if (this.isValidProps(maybeProps)) return new NumericLiteralNode(maybeProps);
    // }
    // static isValidProps(maybeProps: unknown): maybeProps is NumericLiteralNodeProps {
    //     return (
    //         typeof maybeProps === "object"
    //         && maybeProps !== null
    //         && "value" in maybeProps
    //         && typeof maybeProps.value === "string"
    //     )
    // }
    kind() { return NumericLiteralNode.kind; }
    ;
    props() { return this.properties; }
    emit() { return this.properties.value; }
}
exports.NumericLiteralNode = NumericLiteralNode;
NumericLiteralNode.kind = "NumericLiteralNode";
class BinaryExpressionNode {
    constructor(properties) {
        this.properties = properties;
    }
    // static checkThenConstruct(maybeProps: unknown) {
    //     if (this.isValidProps(maybeProps)) return new NumericLiteralNode(maybeProps);
    // }
    // static isValidProps(maybeProps: unknown): maybeProps is NumericLiteralNodeProps {
    //     return (
    //         typeof maybeProps === "object"
    //         && maybeProps !== null
    //         && "value" in maybeProps
    //         && typeof maybeProps.value === "string"
    //     )
    // }
    props() { return this.properties; }
    kind() { return BinaryExpressionNode.kind; }
    ;
    emit() {
        let operator = "";
        switch (this.properties.operator.kind) {
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
        return `${this.properties.left.emit()} ${operator} ${this.properties.right.emit()}`;
    }
}
exports.BinaryExpressionNode = BinaryExpressionNode;
BinaryExpressionNode.kind = "BinaryExpressionNode";
class CallExpressionNode {
    constructor(properties) {
        this.properties = properties;
    }
    props() { return this.properties; }
    kind() { return CallExpressionNode.kind; }
    ;
    emit() {
        if (this.properties.identifier.value === 'debugJS') {
            return `console.log(${`'${this.properties.argument.emit()}'`})`;
        }
        else if (this.properties.identifier.value === 'log') {
            return `console.log(${this.properties.argument.emit()})`;
        }
        else {
            throw new SyntaxError(`Unknown Identifier in call expression: ${this.properties.identifier.value}`);
        }
    }
}
exports.CallExpressionNode = CallExpressionNode;
CallExpressionNode.kind = "CallExpressionNode";
