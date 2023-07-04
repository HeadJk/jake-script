import { Program, deserialize } from "./types";

export function emitter(program: Program): string {
    const output: string[] = [];

    for (const node of program.body) {
        output.push(deserialize(node).emit())
    }

    return output.join('\n');
}