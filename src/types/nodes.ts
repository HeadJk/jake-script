import type { Token, TokenKind } from "./tokens"
import { AdditiveOperator } from "./groupings"

export enum NodeKind {
    NumericLiteralNode = 'NumericLiteralNode',
    CallExpressionNode = 'CallExpressionNode',
    BinaryExpressionNode = 'BinaryExpressionNode'
};

type NodeWithKind = { 
    [Property in keyof (typeof NodeKind)]: {kind: (typeof NodeKind)[Property]}
}

type NodeWithOtherProps = {
    NumericLiteralNode: {
        value: string
    },
    CallExpressionNode: {
        identifier: Token['IdentifierToken']
        argument: AnyNode
    },
    BinaryExpressionNode: {
        left: AnyNode,
        right: AnyNode,
        operator: AdditiveOperator
    }
}

export type Node = NodeWithKind & NodeWithOtherProps;
export type AnyNode = Node[keyof Node];