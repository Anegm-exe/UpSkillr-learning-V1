"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const courses_schema_1 = require("./schemas/courses.schema");
const modules_schema_1 = require("./schemas/modules.schema");
const quizzes_schema_1 = require("./schemas/quizzes.schema");
const responses_schema_1 = require("./schemas/responses.schema");
const progress_schema_1 = require("./schemas/progress.schema");
const notes_schema_1 = require("./schemas/notes.schema");
const authentication_logs_schema_1 = require("./schemas/authentication-logs.schema");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('your-mongo-db-connection-string'),
            mongoose_1.MongooseModule.forFeature([
                { name: 'User', schema: user_schema_1.UserSchema },
                { name: 'Course', schema: courses_schema_1.CourseSchema },
                { name: 'Module', schema: modules_schema_1.ModuleSchema },
                { name: 'Quiz', schema: quizzes_schema_1.QuizSchema },
                { name: 'Response', schema: responses_schema_1.ResponseSchema },
                { name: 'Progress', schema: progress_schema_1.ProgressSchema },
                { name: 'Notes', schema: notes_schema_1.NotesSchema },
                { name: 'AuthenticationLogs', schema: authentication_logs_schema_1.AuthenticationLogsSchema },
            ]),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map