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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarPropsSchema = exports.AvatarProps = exports.AvatarSchema = exports.Avatar = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Avatar = class Avatar {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        maxLength: 100,
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], Avatar.prototype, "ref_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        maxLength: 255,
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], Avatar.prototype, "base_link", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.default.Schema.Types.ObjectId],
        required: true,
        ref: 'avatar_props',
    }),
    __metadata("design:type", Array)
], Avatar.prototype, "props", void 0);
Avatar = __decorate([
    (0, mongoose_1.Schema)()
], Avatar);
exports.Avatar = Avatar;
exports.AvatarSchema = mongoose_1.SchemaFactory.createForClass(Avatar);
let AvatarProps = class AvatarProps {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], AvatarProps.prototype, "prop_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        required: true,
    }),
    __metadata("design:type", Array)
], AvatarProps.prototype, "values", void 0);
AvatarProps = __decorate([
    (0, mongoose_1.Schema)()
], AvatarProps);
exports.AvatarProps = AvatarProps;
exports.AvatarPropsSchema = mongoose_1.SchemaFactory.createForClass(AvatarProps);
//# sourceMappingURL=avatar.schema.js.map