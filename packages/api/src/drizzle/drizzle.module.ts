import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleAsyncProvider, drizzleProvider } from './drizzle.provider';

@Module({
  imports: [ConfigModule],
  providers: [...drizzleProvider],
  exports: [DrizzleAsyncProvider],
})
@Global()
export class DrizzleModule {}
