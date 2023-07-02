import { parser } from "./parser";
import { emitter } from "./emitter";
import { tokenizer } from "./tokenizer";

export function compiler(input: string): string {
    const token = tokenizer(input);
    const ast = parser(token)
    const output = emitter(ast);

    return output;
}

export function interpreter(code: string) {
    return eval(code);
}