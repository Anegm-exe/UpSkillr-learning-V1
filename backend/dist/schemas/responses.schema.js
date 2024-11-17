"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ResponseSchema = new mongoose_1.Schema({
    responseId: {
        type: String,
        unique: true,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    quizId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    answers: [
        {
            questionId: { type: String, required: true },
            answer: { type: String, required: true },
        },
    ],
    score: {
        type: Number,
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});
//# sourceMappingURL=responses.schema.js.map