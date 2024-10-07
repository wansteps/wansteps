import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleAsyncProvider, drizzleProvider } from './drizzle.provider';

@Module({
  imports: [ConfigModule],
  providers: [...drizzleProvider],
  exports: [DrizzleAsyncProvider],
})
export class DrizzleModule {}
