import { CreateAvatarDto } from './dto/create_avatar_dto';
import { AvatarService } from './avatar.service';
export declare class AvatarController {
    private avatarService;
    constructor(avatarService: AvatarService);
    getAllAvatars(): Promise<import("./avatar.interface").IAllAvatars>;
    createAvatarInfo(dto: CreateAvatarDto): Promise<{
        id: import("mongoose").Schema.Types.ObjectId;
    }>;
    deleteAll(): Promise<{
        deleted: number;
    }>;
}
