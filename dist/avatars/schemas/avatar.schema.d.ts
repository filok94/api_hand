import mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare type AvatarDocument = Avatar & Document;
export declare class Avatar {
    ref_name: string;
    base_link: string;
    props: mongoose.Schema.Types.ObjectId[];
}
export declare const AvatarSchema: mongoose.Schema<mongoose.Document<Avatar, any, any>, mongoose.Model<mongoose.Document<Avatar, any, any>, any, any, any>, {}, {}>;
export declare type AvatarPropsDocument = AvatarProps & Document;
export declare class AvatarProps {
    prop_name: string;
    values: string[];
}
export declare const AvatarPropsSchema: mongoose.Schema<mongoose.Document<AvatarProps, any, any>, mongoose.Model<mongoose.Document<AvatarProps, any, any>, any, any, any>, {}, {}>;
