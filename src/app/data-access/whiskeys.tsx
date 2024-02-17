import { db } from '@/db'
import { tastings, whiskeys, Whiskey, tastingWhiskeys } from '@/db/schema';
import { asc, eq, gte, sql, notExists } from 'drizzle-orm'

export type WhiskeyDTO = {
  name: string
  distillery: string
  mashBill: string
  abv: string
  msrp: string
  ageStatement: string
}

export async function getUnusedWhiskeys(tasting_id: string) {
  const availableWhiskeys = await db.execute(
    sql`select * from ${whiskeys} where not exists (select 'x' from ${tastingWhiskeys} where ${tastingWhiskeys.tastingId} = ${tasting_id} and ${tastingWhiskeys.whiskeyId} = ${whiskeys.id})`)
  return availableWhiskeys.rows as Whiskey[];
}

export async function createWhiskey(whiskey: WhiskeyDTO) {
  const result = await db.insert(whiskeys).values({ 
    name: whiskey.name,
    distillery: whiskey.distillery,
    mashBill: whiskey.mashBill,
    abv: whiskey.abv,
    msrp: whiskey.msrp,
    ageStatement: whiskey.ageStatement
   }).returning({ insertedId: whiskeys.id })
  return result[0].insertedId
}