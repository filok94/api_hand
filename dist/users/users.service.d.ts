import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    getAllUsers(): Promise<any>;
}
