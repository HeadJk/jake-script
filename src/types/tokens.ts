export enum TokenKind {
    IdentifierToken = 'IdentifierToken',
    OpenParenToken = 'OpenParenToken',
    CloseParenToken = 'CloseParenToken',
    NumericLiteralToken = 'NumericLiteralToken',
    PlusToken = 'PlusToken',
    MinusToken = 'MinusToken',
    MultiplyToken = 'MultiplyToken',
    DivideToken = 'DivideToken',
};

type TokenWithKind = { 
    [Property in keyof (typeof TokenKind)]: {kind: (typeof TokenKind)[Property]}
}

type TokenWithOtherProps = {
    IdentifierToken: {
        value: string
    }
    NumericLiteralToken: {
        value: string
    }
}

export type Token = TokenWithKind & TokenWithOtherProps;
export type AnyToken = Token[keyof Token];