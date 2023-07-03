"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitter = void 0;
function emitter(program) {
    const output = [];
    for (const node of program.body) {
        output.push(node.emit());
    }
    return output.join('\n');
}
exports.emitter = emitter;
