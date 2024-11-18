"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationLogsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AuthenticationLogsSchema = new mongoose_1.Schema({
    logId: {
        type: String,
        unique: true,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    event: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Success', 'Failure'],
        required: true,
    },
});
//# sourceMappingURL=authentication-logs.schema.js.map