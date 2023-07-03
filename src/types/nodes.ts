import { Token, TokenKind } from "./tokens"
import { AdditiveOperator } from "./groupings"

export enum NodeKind {
    NumericLiteralNode = 'NumericLiteralNode',
    CallExpressionNode = 'CallExpressionNode',
    BinaryExpressionNode = 'BinaryExpressionNode'
};

// type NodeWithKind = { 
//     [Property in keyof (typeof NodeKind)]: {kind: (typeof NodeKind)[Property]}
// }

// type NodeWithOtherProps = {
//     NumericLiteralNode: {
//         value: string
//     },
//     CallExpressionNode: {
//         identifier: Token['IdentifierToken']
//         argument: AnyNode
//     },
//     BinaryExpressionNode: {
//         left: AnyNode,
//         right: AnyNode,
//         operator: AdditiveOperator
//     }
// }

// export type Node = NodeWithKind & NodeWithOtherProps;
// export type AnyNode = Node[keyof Node];

export interface Emitable {
    emit: () => string;
}

export interface Kind {
    kind: () => string;
}

export interface Node extends Emitable {}

export class NumericLiteralNode implements Emitable {
    constructor(private value: string) {}

    emit() {
        return this.value;
    }
}

export class BinaryExpressionNode implements Emitable {
    constructor(
        private left: Emitable, 
        private right: Emitable,
        private operator: AdditiveOperator,
    ) {}

    emit() {
        let operator = "";
        switch(this.operator.kind) {
            case TokenKind.PlusToken: operator = "+"; break;
            case TokenKind.MinusToken: operator = "-"; break;
            case TokenKind.MultiplyToken: operator = "*"; break;
            case TokenKind.DivideToken: operator = "/"; break;
        }
        return `${this.left.emit()} ${operator} ${this.right.emit()}`;
    }
}

export class CallExpressionNode implements Emitable {
    constructor(
        private identifier: Token['IdentifierToken'],
        private argument: Emitable,
    ) {}

    emit() {
        if (this.identifier.value === 'debugJS') {
            return `console.log(${`'${this.argument.emit()}'`})`
        } else if (this.identifier.value === 'log') {
            return `console.log(${this.argument.emit()})`;
        } else {
            throw new SyntaxError(`Unknown Identifier in call expression: ${this.identifier.value}`);
        }
    }
}