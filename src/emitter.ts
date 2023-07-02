import { AnyNode, Node, NodeKind, Program, TokenKind } from "./types";

export function emitter(program: Program): string {
    const emit = (node: AnyNode): string => {
        switch (node.kind) {
            case NodeKind.NumericLiteralNode: return emitNumericLiteral(node);
            case NodeKind.BinaryExpressionNode: return emitBinaryExpression(node);
            case NodeKind.CallExpressionNode: return emitCallExpression(node);
            default: throw new SyntaxError("Unknown node")
        }
    }

    const emitNumericLiteral = (node: Node['NumericLiteralNode']) => node.value;

    const emitBinaryExpression = (node: Node['BinaryExpressionNode']) => {
        let operator = "";
        switch(node.operator.kind) {
            case TokenKind.PlusToken: operator = "+"; break;
            case TokenKind.MinusToken: operator = "-"; break;
            case TokenKind.MultiplyToken: operator = "*"; break;
            case TokenKind.DivideToken: operator = "/"; break;
        }
        return `${emit(node.left)} ${operator} ${emit(node.right)}`;
    }

    const emitCallExpression = (node: Node['CallExpressionNode']) => {
        if (node.identifier.value === 'debugJS') {
            return `console.log(${`'${emit(node.argument)}'`})`
        } else if (node.identifier.value === 'log') {
            return `console.log(${emit(node.argument)})`;
        } else {
            throw new SyntaxError(`Unknown Identifier in call expression: ${node.identifier.value}`);
        }
    }

    const output: string[] = [];
    for (const node of program.body) {
        output.push(emit(node))
    }

    return output.join('\n');
}