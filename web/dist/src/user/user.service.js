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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const drizzle_orm_1 = require("drizzle-orm");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../drizzle/drizzle.provider");
const schema = require("../drizzle/schema");
let UserService = class UserService {
    constructor(db) {
        this.db = db;
    }
    async create(name, email, password) {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        const userData = { name, email, hashedPassword };
        return this.db.insert(schema.user).values(userData).returning();
    }
    async findByEmail(email) {
        return this.db.query.user.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.user.email, email),
        });
    }
    async findOne(id) {
        const user = await this.db.query.user.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.user.id, id),
        });
        if (!user) {
            throw new common_1.BadRequestException(`User not found`);
        }
        return user;
    }
    update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __metadata("design:paramtypes", [typeof (_a = typeof node_postgres_1.NodePgDatabase !== "undefined" && node_postgres_1.NodePgDatabase) === "function" ? _a : Object])
], UserService);
//# sourceMappingURL=user.service.js.map