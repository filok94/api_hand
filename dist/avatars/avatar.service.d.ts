import { IAllAvatars } from './avatar.interface';
import { CreateAvatarDto } from './dto/create_avatar_dto';
import { AvatarDocument, AvatarPropsDocument } from './schemas/avatar.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
export declare class AvatarService {
    private avatarModel;
    private avatarPropsModel;
    constructor(avatarModel: Model<AvatarDocument>, avatarPropsModel: Model<AvatarPropsDocument>);
    getAllAvatars(): Promise<IAllAvatars>;
    createAvatarInfo(dto: CreateAvatarDto): Promise<mongoose.Schema.Types.ObjectId>;
    deleteAllAvatarinfo(): Promise<number>;
}
