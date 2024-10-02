import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique(),
    phoneNumber: varchar('phone_number', { length: 255 }).unique(),
    password: varchar('password', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

export const mailVerification = pgTable('mail_verification', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    code: varchar('code', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
});

export type MailVerification = typeof mailVerification.$inferSelect;
export type MailVerificationInsert = typeof mailVerification.$inferInsert;
