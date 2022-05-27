import { AvatarProp } from './../avatars/dto/create_avatar_dto';
import { Avatar } from './../avatars/schemas/avatar.schema';
export interface IAllAvatars {
    avatars: Avatar[];
    props: AvatarProp[];
}
