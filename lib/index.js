"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const compiler_1 = require("./compiler");
const RUN_COMMAND = '--run';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let args = process.argv.slice(2);
        let run = false;
        if (args.includes(RUN_COMMAND)) {
            run = true;
            args = args.filter(arg => arg !== RUN_COMMAND);
        }
        if (!args.length) {
            throw new Error('No input file provided');
        }
        const fileName = args[0];
        let input = '';
        try {
            input = yield promises_1.default.readFile(fileName, 'utf-8');
        }
        catch (err) {
            console.error(`Unable to access file ${fileName}`);
            throw err;
        }
        const output = (0, compiler_1.compiler)(input);
        if (run) {
            (0, compiler_1.interpreter)(output);
        }
        else {
            const srcFile = path_1.default.parse(fileName);
            const destFile = path_1.default.join(srcFile.dir, srcFile.name + '.js');
            yield promises_1.default.writeFile(destFile, output);
        }
    });
}
main();
