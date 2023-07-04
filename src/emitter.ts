import { AnyNode, AnySerializedNode, Program, deserialize } from "./types";

export function emitter(program: Program): string {
    const output: string[] = [];

    const emitNext = (node: AnySerializedNode): string => {
        return deserialize(node).emit(emitNext)
    }

    for (const node of program.body) {
        output.push(emitNext(node))
    }

    return output.join('\n');
}