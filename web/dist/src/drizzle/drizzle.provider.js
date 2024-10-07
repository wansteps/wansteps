"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drizzleProvider = exports.DrizzleAsyncProvider = void 0;
const config_1 = require("@nestjs/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema = require("./schema");
exports.DrizzleAsyncProvider = 'DrizzleAsyncProvider';
exports.drizzleProvider = [
    {
        provide: exports.DrizzleAsyncProvider,
        inject: [config_1.ConfigService],
        useFactory: async (configService) => {
            const connectionString = configService.get('DATABASE_URL');
            const pool = new pg_1.Pool({
                connectionString,
            });
            return (0, node_postgres_1.drizzle)(pool, { schema });
        },
    },
];
//# sourceMappingURL=drizzle.provider.js.map