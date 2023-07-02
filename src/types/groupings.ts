import { Token } from "./tokens";

export type Any = Token;

export type CharToken =
    Token['CloseParenToken']
    | Token['OpenParenToken']
    | AdditiveOperator

export type GroupToken = 
    Token['NumericLiteralToken']
    | Token['IdentifierToken']

export type AdditiveOperator = 
    Token['PlusToken']
    | Token['MinusToken']
    | Token['MultiplyToken']
    | Token['DivideToken']