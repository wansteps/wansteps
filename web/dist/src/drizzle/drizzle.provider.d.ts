import { ConfigService } from '@nestjs/config';
import * as schema from './schema';
export declare const DrizzleAsyncProvider = "DrizzleAsyncProvider";
export declare const drizzleProvider: {
    provide: string;
    inject: any[];
    useFactory: (configService: ConfigService) => Promise<NodePgDatabase<typeof schema>>;
}[];
