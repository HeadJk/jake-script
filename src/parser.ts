import { Token, Program, Node, TokenKind, NodeKind, AnyToken, AnyNode, TokenGroup } from "./types";

export function parser(tokens: AnyToken[]): Program {
    const program: Program = { body: [] };
    let current = 0;

    const parseNumericLiteral = (token: Token['NumericLiteralToken']): Node['NumericLiteralNode'] => {
        current++;
        return { kind: NodeKind.NumericLiteralNode, value: token.value}
    }

    const parseCallExpression = (token: Token['IdentifierToken']): Node['CallExpressionNode'] => {
        const identifier = token;
        current++;

        if(tokens[current].kind !== TokenKind.OpenParenToken) {
            throw new SyntaxError('Identifier must be followed by a (')
        }
        current++;

        const argument: AnyNode = parse();

        if(tokens[current].kind !== TokenKind.CloseParenToken) {
            throw new SyntaxError('Call expressions must terminate with a )')
        }
        current++;

        return { kind: NodeKind.CallExpressionNode, identifier, argument}
    }

    const parseBinaryExpression = (token: Token['NumericLiteralToken'], next: TokenGroup.AdditiveOperator): Node['BinaryExpressionNode'] => {
        const left = parseNumericLiteral(token)

        const operator = next;
        current++;

        const right = parse()
        return { kind: NodeKind.BinaryExpressionNode, left, operator, right }
    }

    const parse = (): AnyNode => {
        const token = tokens[current]

        if (token.kind === TokenKind.IdentifierToken) {
            return parseCallExpression(token);
        }

        if(token.kind == TokenKind.NumericLiteralToken) {
            const next = tokens[current + 1]
            if(next.kind === TokenKind.PlusToken || next.kind === TokenKind.MinusToken ||
                next.kind === TokenKind.MultiplyToken || next.kind === TokenKind.DivideToken) {
                return parseBinaryExpression(token, next);
            }
            else {
                return parseNumericLiteral(token)
            }
        }

        throw new SyntaxError(`Unexpected token ${token}`)
    }

    while (current < tokens.length) {
        program.body.push(parse())
    }

    return program;
}