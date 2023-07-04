import { AnySerializedNode, AnyToken, BinaryExpressionNode, CallExpressionNode, NumericLiteralNode, Program, Token, TokenGroup, TokenKind } from "./types";

export function parser(tokens: AnyToken[]): Program {
    const program: Program = { body: [] };
    let current = 0;

    const parseNumericLiteral = (token: Token['NumericLiteralToken']) => {
        current++;

        const props = { value: token.value };

        return { kind: NumericLiteralNode.kind, props}
    }

    const parseCallExpression = (token: Token['IdentifierToken']) => {
        const identifier = token;
        current++;

        if(tokens[current].kind !== TokenKind.OpenParenToken) {
            throw new SyntaxError('Identifier must be followed by a (')
        }
        current++;

        const argument = parse();

        if(tokens[current].kind !== TokenKind.CloseParenToken) {
            throw new SyntaxError('Call expressions must terminate with a )')
        }
        current++;

        const props = {identifier, argument};
        
        return { kind: CallExpressionNode.kind, props }
    }

    const parseBinaryExpression = (token: Token['NumericLiteralToken'], next: TokenGroup.AdditiveOperator) => {
        const left = parseNumericLiteral(token)

        const operator = next;
        current++;

        const right = parse()
        
        const props = {left, right, operator};
        
        return { kind: BinaryExpressionNode.kind, props }
    }

    const parse = (): AnySerializedNode  => {
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