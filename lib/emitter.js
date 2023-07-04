"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitter = void 0;
const types_1 = require("./types");
function emitter(program) {
    const output = [];
    for (const node of program.body) {
        output.push((0, types_1.deserialize)(node).emit());
    }
    return output.join('\n');
}
exports.emitter = emitter;
