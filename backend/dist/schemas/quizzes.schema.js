"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSchema = void 0;
const mongoose_1 = require("mongoose");
exports.QuizSchema = new mongoose_1.Schema({
    quizId: {
        type: String,
        unique: true,
        required: true,
    },
    moduleId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
    },
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String }],
            correctAnswer: { type: String, required: true },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
//# sourceMappingURL=quizzes.schema.js.map