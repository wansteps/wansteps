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
var MailService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const dm20151123_1 = require("@alicloud/dm20151123");
const $OpenApi = require("@alicloud/openapi-client");
const tea_util_1 = require("@alicloud/tea-util");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const drizzle_orm_1 = require("drizzle-orm");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../drizzle/drizzle.provider");
const schema = require("../drizzle/schema");
let MailService = MailService_1 = class MailService {
    constructor(db, configService) {
        this.db = db;
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        const config = new $OpenApi.Config({
            accessKeyId: configService.get('ALIBABA_CLOUD_ACCESS_KEY_ID'),
            accessKeySecret: configService.get('ALIBABA_CLOUD_ACCESS_KEY_SECRET'),
        });
        config.endpoint = `dm.aliyuncs.com`;
        this.client = new dm20151123_1.default(config);
        this.mailAllowedList = configService.get('MAIL_ALLOWED_LIST', '')
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);
    }
    async sendVerificationCode({ email, code }) {
        const singleSendMailRequest = new dm20151123_1.SingleSendMailRequest({
            accountName: this.configService.get('MAIL_FROM'),
            fromAlias: this.configService.get('MAIL_FROM_NAME'),
            addressType: 1,
            replyToAddress: false,
            toAddress: email,
            subject: '验证码',
            htmlBody: `您的验证码是：${code}`,
        });
        const runtime = new tea_util_1.RuntimeOptions({});
        try {
            await this.client.singleSendMailWithOptions(singleSendMailRequest, runtime);
        }
        catch (error) {
            this.logger.error(error);
            this.logger.error(error.data['Recommend']);
        }
    }
    async createMailVerification(email) {
        if (this.isEmailNotAllowed(email)) {
            throw new common_1.BadRequestException('Email not allowed');
        }
        const code = this.generateRandomCode();
        const mailVerification = { email, code };
        const existingCode = await this.db.query.mailVerification.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.mailVerification.email, email),
        });
        if (existingCode && this.isSendFrequently(existingCode.updatedAt)) {
            throw new common_1.BadRequestException('发送频率太快，请稍后再试');
        }
        this.db
            .insert(schema.mailVerification)
            .values(mailVerification)
            .onConflictDoUpdate({
            target: schema.mailVerification.email,
            set: { code },
        })
            .execute();
        return mailVerification;
    }
    generateRandomCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    }
    async verifyCode(email, code) {
        const mailVerification = await this.db.query.mailVerification.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.mailVerification.email, email),
        });
        if (!mailVerification ||
            mailVerification.code !== code ||
            this.isCodeExpired(mailVerification.updatedAt)) {
            throw new common_1.BadRequestException('Invalid email verification code');
        }
        this.db
            .delete(schema.mailVerification)
            .where((0, drizzle_orm_1.eq)(schema.mailVerification.email, email))
            .execute();
    }
    isCodeExpired(updatedAt) {
        return Date.now() - new Date(updatedAt).getTime() > 10 * 60 * 1000;
    }
    isSendFrequently(updatedAt) {
        return Date.now() - new Date(updatedAt).getTime() < 1 * 60 * 1000;
    }
    isEmailNotAllowed(email) {
        return (this.mailAllowedList.length == 0 || !this.mailAllowedList.includes(email));
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __metadata("design:paramtypes", [typeof (_a = typeof node_postgres_1.NodePgDatabase !== "undefined" && node_postgres_1.NodePgDatabase) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], MailService);
//# sourceMappingURL=mail.service.js.map