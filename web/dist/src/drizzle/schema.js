"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailVerification = exports.user = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.user = (0, pg_core_1.pgTable)('user', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).unique(),
    phoneNumber: (0, pg_core_1.varchar)('phone_number', { length: 255 }).unique(),
    password: (0, pg_core_1.varchar)('password', { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
exports.mailVerification = (0, pg_core_1.pgTable)('mail_verification', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    code: (0, pg_core_1.varchar)('code', { length: 255 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date()),
});
//# sourceMappingURL=schema.js.map