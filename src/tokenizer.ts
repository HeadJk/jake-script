import { Token, TokenGroup, TokenKind, AnyToken } from "./types";

export function tokenizer(input: string): AnyToken[] {
    const NUMBERS = /[0-9]/;
    const LETTERS = /[a-zA-Z]/;

    const tokens: AnyToken[] = [];
    let cursorPos = 0;

    const readIn = () => input[cursorPos];

    const tokenize = (tokenizeCondition: boolean, tokenGenerator: () => AnyToken) => {
        if(tokenizeCondition) {
            tokens.push(tokenGenerator())
        }
        return tokenizeCondition;
    }

    const tokenizeWhiteSpace = () => {
        const condition = /\s/.test(readIn());
        if(condition) {
            cursorPos++;
        }
        return condition;
    }

    const tokenizeChar = (char: string, tokenKind: TokenGroup.CharToken['kind']) =>
        tokenize(
            char === readIn(), 
            () => { cursorPos++; return { kind: tokenKind } }
        );
        

    const tokenizeGroup = (checkIsPartOfGroup: (char: string) => boolean, tokenKind: TokenGroup.GroupToken['kind']) => 
        tokenize(
            checkIsPartOfGroup(readIn()), 
            () => {
                let value = "";
                let char = readIn();
                while(checkIsPartOfGroup(char)) {
                    value += char;
                    cursorPos++;
                    char = readIn();;
                }
                return { kind: tokenKind, value }
            }
        )
    
    const tokenizeGroupRegExp = (regExp: RegExp, tokenKind: TokenGroup.GroupToken['kind']) =>
        tokenizeGroup((char) => regExp.test(char), tokenKind)

    while (cursorPos < input.length) {
        let isFailedTokenize = false;

        tokenizeWhiteSpace() ||
        tokenizeChar('(', TokenKind.OpenParenToken) ||
        tokenizeChar(')', TokenKind.CloseParenToken) ||
        tokenizeChar('+', TokenKind.PlusToken) ||
        tokenizeChar('-', TokenKind.MinusToken) ||
        tokenizeChar('*', TokenKind.MultiplyToken) ||
        tokenizeChar('/', TokenKind.DivideToken) ||
        tokenizeGroupRegExp(NUMBERS, TokenKind.NumericLiteralToken) ||
        tokenizeGroupRegExp(LETTERS, TokenKind.IdentifierToken) ||
        (isFailedTokenize = true);

        if(isFailedTokenize) throw new SyntaxError(`Unexpected token: "${readIn()}"`)
    }

    return tokens;
}