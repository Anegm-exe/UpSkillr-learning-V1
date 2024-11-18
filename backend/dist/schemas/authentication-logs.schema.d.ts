import { Schema, Document } from 'mongoose';
export declare const AuthenticationLogsSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    userId: string;
    logId: string;
    event: string;
    timestamp: NativeDate;
    status: "Success" | "Failure";
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: string;
    logId: string;
    event: string;
    timestamp: NativeDate;
    status: "Success" | "Failure";
}>> & import("mongoose").FlatRecord<{
    userId: string;
    logId: string;
    event: string;
    timestamp: NativeDate;
    status: "Success" | "Failure";
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface AuthenticationLogs extends Document {
    logId: string;
    userId: string;
    event: string;
    timestamp: Date;
    status: string;
}
