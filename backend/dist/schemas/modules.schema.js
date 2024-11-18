"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ModuleSchema = new mongoose_1.Schema({
    moduleId: {
        type: String,
        unique: true,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    resources: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
//# sourceMappingURL=modules.schema.js.map