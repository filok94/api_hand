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
exports.TestDataSchema = exports.TestData = exports.PersonSchema = exports.Person = exports.GameSchema = exports.Game = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Game = class Game {
};
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        maxlength: 50,
        type: String,
    }),
    __metadata("design:type", String)
], Game.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        maxlength: 255,
        type: String,
    }),
    __metadata("design:type", String)
], Game.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: String,
    }),
    __metadata("design:type", String)
], Game.prototype, "link", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: [mongoose_2.default.Schema.Types.ObjectId],
        ref: 'Person',
    }),
    __metadata("design:type", Array)
], Game.prototype, "persons", void 0);
Game = __decorate([
    (0, mongoose_1.Schema)()
], Game);
exports.Game = Game;
exports.GameSchema = mongoose_1.SchemaFactory.createForClass(Game);
let Person = class Person {
};
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        maxlength: 50,
        type: String,
    }),
    __metadata("design:type", String)
], Person.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        maxlength: 150,
        type: String,
    }),
    __metadata("design:type", String)
], Person.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        maxlength: 150,
        type: String,
    }),
    __metadata("design:type", String)
], Person.prototype, "link", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        isInteger: true,
        type: Number,
    }),
    __metadata("design:type", Number)
], Person.prototype, "count", void 0);
Person = __decorate([
    (0, mongoose_1.Schema)()
], Person);
exports.Person = Person;
exports.PersonSchema = mongoose_1.SchemaFactory.createForClass(Person);
let TestData = class TestData {
};
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: Number,
        max: 15,
    }),
    __metadata("design:type", Number)
], TestData.prototype, "index", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        maxlength: 300,
        type: String,
    }),
    __metadata("design:type", String)
], TestData.prototype, "question", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: [String],
    }),
    __metadata("design:type", Array)
], TestData.prototype, "answers", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'Game',
    }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], TestData.prototype, "game", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: Number,
        validate: {
            validator: function (v) {
                this.answers.length <= v;
            },
        },
    }),
    __metadata("design:type", Number)
], TestData.prototype, "right_answer", void 0);
TestData = __decorate([
    (0, mongoose_1.Schema)()
], TestData);
exports.TestData = TestData;
exports.TestDataSchema = mongoose_1.SchemaFactory.createForClass(TestData);
//# sourceMappingURL=game.schema.js.map