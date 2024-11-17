"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['student', 'instructor', 'admin'] },
    profilePictureUrl: { type: String, required: false },
}, { timestamps: { createdAt: 'createdAt' } });
//# sourceMappingURL=user.schema.js.map