import Dm20151123, { SingleSendMailRequest } from '@alicloud/dm20151123';
import * as $OpenApi from '@alicloud/openapi-client';

import { RuntimeOptions } from '@alicloud/tea-util';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { IMailVerification } from './interface/mail-verification.interface';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    private client: Dm20151123;

    constructor(@Inject(DrizzleAsyncProvider) private readonly db: NodePgDatabase<typeof schema>,
        private readonly configService: ConfigService) {
        let config = new $OpenApi.Config({
            accessKeyId: configService.get<string>('ALIBABA_CLOUD_ACCESS_KEY_ID'),
            accessKeySecret: configService.get<string>('ALIBABA_CLOUD_ACCESS_KEY_SECRET'),
        });
        // Endpoint 请参考 https://api.aliyun.com/product/Dm
        config.endpoint = `dm.aliyuncs.com`;
        this.client = new Dm20151123(config);
    }

    async sendVerificationCode({ email, code }: IMailVerification) {
        let singleSendMailRequest = new SingleSendMailRequest({
            accountName: this.configService.get<string>('MAIL_FROM'),
            fromAlias: this.configService.get<string>('MAIL_FROM_NAME'),
            addressType: 1,
            replyToAddress: false,
            toAddress: email,
            subject: '验证码',
            htmlBody: `您的验证码是：${code}`,
        });
        let runtime = new RuntimeOptions({});
        try {
            await this.client.singleSendMailWithOptions(singleSendMailRequest, runtime);
        } catch (error) {
            this.logger.error(error);
            this.logger.error(error.data["Recommend"]);
        }
    }

    async createMailVerification(email: string): Promise<IMailVerification> {
        const code = this.generateRandomCode();
        const mailVerification = { email, code };
        const existingCode = await this.db.query.mailVerification.findFirst({
            where: eq(schema.mailVerification.email, email)
        })
        if (existingCode && this.isCodeFrequency(existingCode.updatedAt)) {
            throw new BadRequestException('发送频率太快，请稍后再试');
        }
        this.db.insert(schema.mailVerification)
            .values(mailVerification)
            .onConflictDoUpdate({
                target: schema.mailVerification.email,
                set: { code }
            })
            .execute();
        return mailVerification;
    }

    private generateRandomCode(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');

    }

    async verifyCode(email: string, code: string) {
        const mailVerification = await this.db.query.mailVerification.findFirst({
            where: eq(schema.mailVerification.email, email),
        });
        if (!mailVerification || mailVerification.code !== code || this.isCodeExpired(mailVerification.updatedAt)) {
            throw new BadRequestException('Invalid email verification code');
        }
        this.db.delete(schema.mailVerification).where(eq(schema.mailVerification.email, email)).execute()
    }

    private isCodeExpired(updatedAt: Date): boolean {
        return Date.now() - new Date(updatedAt).getTime() > 10 * 60 * 1000;
    }

    private isCodeFrequency(updatedAt: Date): boolean {
        return Date.now() - new Date(updatedAt).getTime() < 1 * 60 * 1000;
    }
}
