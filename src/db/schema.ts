import { boolean, date, decimal, integer, pgEnum, pgTable, primaryKey, text, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: varchar('id', { length: 32 }).primaryKey(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  admin: boolean('admin').default(false)
})

export type User = typeof users.$inferSelect

export const tastingStateEnum = pgEnum('tastingState', ['setup', 'signup', 'started', 'finished']);

export const tastings = pgTable('tastings', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  hostId: varchar('host_id', { length: 32 }).references(() => users.id),
  date: date('date', { mode: "string" }),
  blind: boolean('blind').default(false),
  description: text('description'),
  flights: integer('flights').default(1),
  state: tastingStateEnum('tastingState').default('setup').notNull()
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
  position: integer('position'),
  flight: integer('flight').default(1)
})

export type TastingWhiskey = typeof tastingWhiskeys.$inferSelect


export const tastingsRelations = relations(tastings, ({ many }) => ({
  tastingWhiskeys: many(tastingWhiskeys),
  userRaings: many(userRatings)
}))

export const whiskeyRelations = relations(whiskeys, ({ many }) => ({
  tastingWhiskeys: many(tastingWhiskeys)
}))

export const tastingWhiskeyRelations = relations(tastingWhiskeys, ({ one, many }) => ({
  whiskey: one(whiskeys, {
    fields: [tastingWhiskeys.whiskeyId],
    references: [whiskeys.id]
  }),
  tasting: one(tastings, {
    fields: [tastingWhiskeys.tastingId],
    references: [tastings.id]
  }),
  userRatings: many(userRatings)
}))

export const tastingAttendees = pgTable('tasting_attendees', {
  id: uuid('id').defaultRandom().primaryKey(),
  tastingId: uuid('tasting_id').references(() => tastings.id).notNull(),
  userId: varchar('user_id', { length: 32 }).references(() => users.id),
})

export const tastingAttendeeRelations = relations(tastingAttendees, ({ one }) => ({
  user: one(users, {
    fields: [tastingAttendees.userId],
    references: [users.id]
  }),
  tasting: one(tastings, {
    fields: [tastingAttendees.tastingId],
    references: [tastings.id]
  })
}))

export const userRatings = pgTable('user_ratings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 32 }).references(() => users.id).notNull(),
  tastingId: uuid('tasting_id').references(() => tastings.id).notNull(),
  tastingWhiskeyId: uuid('tastingWhiskeyId').references(() => tastingWhiskeys.id).notNull(),
  whiskeyId: uuid('whiskey_id').references(()=> whiskeys.id).notNull(),
  flight: integer('flight').notNull().default(1),
  position: integer('position').notNull().default(1),
  rating: decimal('rating', { precision: 2, scale: 1 }),
  tastingNotes: text('tasting_notes'),
  nosingNotes: varchar('nosing_notes'),
})
export type UserRating = typeof userRatings.$inferSelect

export const userRatingRelations = relations(userRatings, ({ one }) => ({
  user: one(users, {
    fields: [userRatings.userId],
    references: [users.id]
  }),
  tasting: one(tastings, { fields: [userRatings.tastingId], references: [tastings.id]}),
  tastingWhiskey: one(tastingWhiskeys, { fields: [userRatings.tastingWhiskeyId], references: [tastingWhiskeys.id]}),
  whiskey: one(whiskeys, { fields: [userRatings.whiskeyId], references: [whiskeys.id]})
}))
