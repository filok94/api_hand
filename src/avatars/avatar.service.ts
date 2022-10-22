import { ErrorMessages } from "./../exceptions/exceptions";
import { DtoSaveAvatar } from "./dto/save_avatar.dto";
import { TokenService } from "./../auth/token.service";
import { IReturnedOneAvatar } from "./interfaces/avatar.interface.d";
import { IAllAvatar } from "./interfaces/avatar.interface";
import { CreateAvatarDto } from "./dto/create_avatar_dto";
import {
	Avatar,
	AvatarDocument,
	UserAvatar,
	UserAvatarDocument,
} from "./schemas/avatar.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import mongoose from "mongoose";

@Injectable()
export class AvatarService {
	constructor(
		@InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>,
		@InjectModel(UserAvatar.name)
		private userAvatarModel: Model<UserAvatarDocument>,
		private tokenService: TokenService
	) {}

	async getAllAvatars(): Promise<IAllAvatar[]> {
		try {
			const avatarsMapped = await this.avatarModel.aggregate<IAllAvatar>([
				{
					$project: { ref_name: 1, base_link: 1, id: 1 },
				},
			]);

			return avatarsMapped;
		} catch (e) {
			throw new Error(e);
		}
	}

	async getAvatarById(
		id: mongoose.Schema.Types.ObjectId
	): Promise<IReturnedOneAvatar> {
		try {
			const avatarsMapped =
				await this.avatarModel.aggregate<IReturnedOneAvatar>([
					{ $match: { _id: new mongoose.Types.ObjectId(String(id)) } },
					{
						$project: { ref_name: 1, base_link: 1, _id: 1, props: 1 },
					},
				]);
			//error handling
			if (!avatarsMapped.length) {
				throw new Error(ErrorMessages.CANNOT_FIND_AVATAR);
			}
			return {
				...avatarsMapped[0],
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	async saveAvatarForUser(
		userToken: string,
		avatarInfo: DtoSaveAvatar
	): Promise<boolean> {
		try {
			const user = await this.tokenService.getUserByToken(userToken);
			const avatarLinkInDb = (await this.getAvatarById(avatarInfo.avatar))
				.base_link;

			// error handling
			const linkAndIdComparingCheck =
				avatarInfo.full_link.includes(avatarLinkInDb);
			const idExistingCheck = avatarLinkInDb != undefined;
			if (!idExistingCheck) {
				throw new Error(ErrorMessages.CANNOT_FIND_AVATAR);
			}
			if (!linkAndIdComparingCheck) {
				throw new Error(ErrorMessages.LINK_NOT_RELATE_TO_AVATAR);
			}

			//recording
			const newRecord = await this.userAvatarModel.updateOne(
				{
					user: user.id,
				},
				{
					user: user._id,
					full_link: avatarInfo.full_link,
					avatar: avatarInfo.avatar,
				},
				{ new: true, upsert: true, rawResult: true, strict: false }
			);

			return newRecord.acknowledged;
		} catch (e) {
			throw new Error(e);
		}
	}

	async getUserAvatarLink(token: string): Promise<string> {
		try {
			const avatarInfo = await this.userAvatarModel.aggregate<{
				full_link: string;
			}>([
				{
					$lookup: {
						from: "tokens",
						foreignField: "user",
						localField: "user",
						as: "tokensObj",
					},
				},
				{ $match: { "tokensObj.access_token": token } },
				{ $project: { full_link: true, _id: false } },
			]);
			if (avatarInfo.length === 0) {
				return (await this.avatarModel.find())[0].base_link;
			}
			return avatarInfo[0].full_link;
		} catch (e) {
			throw new Error(e);
		}
	}

	async createAvatarInfo(
		dto: CreateAvatarDto
	): Promise<mongoose.Schema.Types.ObjectId> {
		try {
			const avatarNewObject = await this.avatarModel.create({
				...dto,
			});
			return avatarNewObject._id;
		} catch (e) {
			throw new Error(e);
		}
	}
}
