"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarService = void 0;
const avatar_schema_1 = require("./schemas/avatar.schema");
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("mongoose");
let AvatarService = class AvatarService {
    constructor(avatarModel, avatarPropsModel) {
        this.avatarModel = avatarModel;
        this.avatarPropsModel = avatarPropsModel;
    }
    async getAllAvatars() {
        try {
            const props = await this.avatarPropsModel.find();
            const avatars = await this.avatarModel.find();
            return { avatars, props };
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async createAvatarInfo(dto) {
        try {
            const ids = [];
            for (const prop of dto.props) {
                const newProp = await this.avatarPropsModel.create({
                    prop_name: prop.prop_name,
                    values: prop.values,
                });
                ids.push(newProp._id);
            }
            const avatarInfo = await this.avatarModel.create({
                ref_name: dto.ref_name,
                base_link: dto.base_link,
                props: ids,
            });
            return avatarInfo._id;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async deleteAllAvatarinfo() {
        try {
            const deletedProps = (await this.avatarPropsModel.deleteMany())
                .deletedCount;
            const deletedAvatarInfo = (await this.avatarModel.deleteMany())
                .deletedCount;
            return Math.max(deletedAvatarInfo, deletedProps);
        }
        catch (e) {
            throw new Error(e);
        }
    }
};
AvatarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(avatar_schema_1.Avatar.name)),
    __param(1, (0, mongoose_1.InjectModel)(avatar_schema_1.AvatarProps.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AvatarService);
exports.AvatarService = AvatarService;
//# sourceMappingURL=avatar.service.js.map