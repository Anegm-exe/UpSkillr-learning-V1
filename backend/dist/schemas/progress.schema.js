"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ProgressSchema = new mongoose_1.Schema({
    progressId: {
        type: String,
        unique: true,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    completionPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    lastAccessed: {
        type: Date,
        default: Date.now,
    },
});
//# sourceMappingURL=progress.schema.js.map