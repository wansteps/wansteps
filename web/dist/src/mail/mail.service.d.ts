import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema';
import { IMailVerification } from './interface/mail-verification.interface';
export declare class MailService {
    private readonly db;
    private readonly configService;
    private readonly logger;
    private client;
    private mailAllowedList;
    constructor(db: NodePgDatabase<typeof schema>, configService: ConfigService);
    sendVerificationCode({ email, code }: IMailVerification): Promise<void>;
    createMailVerification(email: string): Promise<IMailVerification>;
    private generateRandomCode;
    verifyCode(email: string, code: string): Promise<void>;
    private isCodeExpired;
    private isSendFrequently;
    private isEmailNotAllowed;
}
