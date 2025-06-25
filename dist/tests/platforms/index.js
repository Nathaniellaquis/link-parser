"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load every *.test.ts in this directory (excluding this file).
const dir = __dirname;
fs_1.default.readdirSync(dir)
    .filter(f => f.endsWith('.test.ts') && f !== 'index.ts')
    .forEach(f => {
    require(path_1.default.join(dir, f));
});
