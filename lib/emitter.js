"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitter = void 0;
const types_1 = require("./types");
function emitter(program) {
    const output = [];
    const emitNext = (node) => {
        return (0, types_1.deserialize)(node).emit(emitNext);
    };
    for (const node of program.body) {
        output.push(emitNext(node));
    }
    return output.join('\n');
}
exports.emitter = emitter;
