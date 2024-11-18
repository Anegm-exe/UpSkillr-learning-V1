"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesSchema = void 0;
const mongoose_1 = require("mongoose");
exports.NotesSchema = new mongoose_1.Schema({
    noteId: {
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
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});
//# sourceMappingURL=notes.schema.js.map