import mongoose from 'mongoose';
export declare class Session {
    refreshToken: string;
    user: mongoose.Schema.Types.ObjectId;
}
export declare const SessionSchema: mongoose.Schema<mongoose.Document<Session, any, any>, mongoose.Model<mongoose.Document<Session, any, any>, any, any, any>, {}, {}>;
