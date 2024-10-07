"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/drizzle/schema.ts',
    dialect: 'postgresql',
    out: './src/drizzle/migrations',
    migrations: {
        prefix: 'supabase'
    },
    dbCredentials: {
        url: process.env.DATABASE_URL
    },
    verbose: true,
    strict: true
});
//# sourceMappingURL=drizzle.config.js.map