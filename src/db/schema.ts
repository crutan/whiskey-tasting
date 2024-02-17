import { boolean, date, decimal, integer, pgTable, primaryKey, text, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: varchar('id', { length: 32 }).primaryKey(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  admin: boolean('admin').default(false)
})

export type User = typeof users.$inferSelect

export const tastings = pgTable('tastings', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  hostId: varchar('host_id', { length: 32 }).references(() => users.id),
  date: date('date', { mode: "string" }),
  blind: boolean('blind').default(false),
  description: text('description'),
  ready_for_signup: boolean('ready_for_signup').default(false),
})

export type Tasting = typeof tastings.$inferSelect

export const tastingHostRelation = relations(tastings, ({ one }) => ({
  host: one(users, {
    fields: [tastings.hostId],
    references: [users.id]
  })
}))

export const whiskeys = pgTable('whiskeys', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  ageStatement: varchar('age_statement'),
  distillery: varchar('distillery').notNull(),
  abv: decimal('abv', { precision: 4, scale: 2 }),
  msrp: decimal('msrp', { precision: 6, scale: 2 }),
  mashBill: varchar('mash_bill')
})

export type Whiskey = typeof whiskeys.$inferSelect

export const tastingWhiskeys = pgTable('tasting_whiskeys', {
  id: uuid('id').defaultRandom().primaryKey(),
  whiskeyId: uuid('whiskey_id').references(() => whiskeys.id).notNull(),
  tastingId: uuid('tasting_id').references(() => tastings.id).notNull(),
  position: integer('position')
})

export type TastingWhiskey = typeof tastingWhiskeys.$inferSelect


export const tastingsRelations = relations(tastings, ({ many }) => ({
  tastingWhiskeys: many(tastingWhiskeys)
}))

export const whiskeyRelations = relations(whiskeys, ({ many }) => ({
  tastingWhiskeys: many(tastingWhiskeys)
}))

export const tastingWhiskeyRelations = relations(tastingWhiskeys, ({ one }) => ({
  whiskey: one(whiskeys, {
    fields: [tastingWhiskeys.whiskeyId],
    references: [whiskeys.id]
  }),
  tasting: one(tastings, {
    fields: [tastingWhiskeys.tastingId],
    references: [tastings.id]
  })
}))


