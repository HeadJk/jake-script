import { Program } from "./types";

export function emitter(program: Program): string {
    const output: string[] = [];

    for (const node of program.body) {
        output.push(node.emit())
    }

    return output.join('\n');
}