import { AdditiveOperator, Any } from "./groupings";
import { Token, TokenKind } from "./tokens";

// export enum NodeKind {
//     NumericLiteralNode = 'NumericLiteralNode',
//     CallExpressionNode = 'CallExpressionNode',
//     BinaryExpressionNode = 'BinaryExpressionNode'
// };

export type GetKind<T extends Kind> = {
    kind: ReturnType<T['kind']>,
}

export type GetProps<T extends Props<{}>> = {
    props: ReturnType<T['props']>
}

type Distribute<U> = U extends Kind & Props<{}> ? GetKind<U> & GetProps<U> : never;

export type GetSerializedNodeDistributed<T extends Kind & Props<{}>> = Distribute<T>
export type GetSerializedNodeS<T extends Kind & Props<{}>> = GetKind<T> & GetProps<T>

export type AnyNode =
    NumericLiteralNode
    | BinaryExpressionNode
    | CallExpressionNode

export type AnySerializedNode = GetSerializedNodeDistributed<AnyNode>

// class ParserError extends Error {
//     constructor(kind: string, message: string) {
//         super(`Node kind: ${kind}\n${message}`);

//         // needed for CustomError instanceof Error => true
//         Object.setPrototypeOf(this, new.target.prototype);

//         this.name = this.constructor.name;

//         // Maintains proper stack trace for where our error was thrown (only available on V8)
//         if (Error.captureStackTrace) {
//             Error.captureStackTrace(this, this.constructor)
//         }
//     }
// }

export interface Emitable {
    emit: () => string;
}

export interface Kind {
    kind: () => string;
}

export interface Props<P extends Object> {
    props: () => P;
}

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

export function serialize(node: AnyNode): AnySerializedNode {
    const props = node.props();
    for(const key in props) {
        const elem = props[key as keyof typeof props] as unknown;
    }
    return {
        kind: node.kind(),
        props: node.props(),
    } as AnySerializedNode
}

export function deserialize(serializedNode: AnySerializedNode): AnyNode {
    const {kind, props} = serializedNode;

    switch(kind) {
        case "NumericLiteralNode": return new NumericLiteralNode(props)
        case "BinaryExpressionNode": return new BinaryExpressionNode(props)
        case "CallExpressionNode": return new CallExpressionNode(props)
    }
}

export interface Node<P extends Object> extends Emitable, Kind, Props<P> { }

export function isNode(node: unknown): node is Node<{}> {
    
}

export type NumericLiteralNodeProps = {
    value: string
}

export class NumericLiteralNode implements Node<NumericLiteralNodeProps> {
    constructor(private properties: NumericLiteralNodeProps) { }

    static kind = "NumericLiteralNode" as const;

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

    kind() { return NumericLiteralNode.kind };

    props() { return this.properties }

    emit() { return this.properties.value }
}

export type BinaryExpressionNodeProps = {
    left: Node<{}>,
    right: Node<{}>,
    operator: AdditiveOperator,
}

export class BinaryExpressionNode implements Node<BinaryExpressionNodeProps> {
    constructor( private properties: BinaryExpressionNodeProps ) {}

    static kind = "BinaryExpressionNode" as const;

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

    props() { return this.properties }

    kind() { return BinaryExpressionNode.kind };

    emit() {
        let operator = "";
        switch (this.properties.operator.kind) {
            case TokenKind.PlusToken: operator = "+"; break;
            case TokenKind.MinusToken: operator = "-"; break;
            case TokenKind.MultiplyToken: operator = "*"; break;
            case TokenKind.DivideToken: operator = "/"; break;
        }
        return `${this.properties.left.emit()} ${operator} ${this.properties.right.emit()}`;
    }
}

export type CallExpressionNodeProps = {
    identifier: Token['IdentifierToken'],
    argument: Node<{}>,
}
export class CallExpressionNode implements Node<CallExpressionNodeProps> {
    constructor( private properties: CallExpressionNodeProps ) { }

    static kind = "CallExpressionNode" as const;

    props() { return this.properties }

    kind() { return CallExpressionNode.kind };

    emit() {
        if (this.properties.identifier.value === 'debugJS') {
            return `console.log(${`'${this.properties.argument.emit()}'`})`
        } else if (this.properties.identifier.value === 'log') {
            return `console.log(${this.properties.argument.emit()})`;
        } else {
            throw new SyntaxError(`Unknown Identifier in call expression: ${this.properties.identifier.value}`);
        }
    }
}