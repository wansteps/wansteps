import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [DrizzleModule, ConfigModule],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
