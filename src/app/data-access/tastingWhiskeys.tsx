import { db } from '@/db'
import { whiskeys, tastingWhiskeys } from '@/db/schema';
import { WhiskeyDTO, createWhiskey } from './whiskeys'
import { asc, eq, gte, sql } from 'drizzle-orm'
import { TastingDTO } from './tastings';
export type TastingWhiskeyDTO = {
  id: string
  tastingId: string
  whiskeyId: string
  position: number
}

export async function getTastingWhiskeys(tasting: string) {
  const result = await db.query.tastingWhiskeys.findMany({ 
    where: eq(tastingWhiskeys.tastingId, tasting),
    with: {
      whiskey: true
    },
    orderBy: [asc(tastingWhiskeys.position)]
  })
  return result
}

export async function updateTastingWhiskeyPosition(id: string, position: number) {
  await db.update(tastingWhiskeys).set({ position: position }).where(eq(tastingWhiskeys.id, id))
}

export async function selectTastingWhiskey(tastingWhiskey: Omit<TastingWhiskeyDTO, 'id'>) {
  const newTastingWhiskey = await db.insert(tastingWhiskeys).values({
    tastingId: tastingWhiskey.tastingId,
    whiskeyId: tastingWhiskey.whiskeyId,
    position: tastingWhiskey.position
  }).returning({ insertedId: tastingWhiskeys.id })
}

export async function addTastingWhiskey(whiskey: WhiskeyDTO, tasting: string, position: number) {
  const newWhiskeyId = await createWhiskey(whiskey);
  await db.insert(tastingWhiskeys).values({
    tastingId: tasting,
    whiskeyId: newWhiskeyId,
    position: position
  })
}

export async function removeTastingWhiskey(tastingWhiskeyId: string) {
  const tastingId = await db.delete(tastingWhiskeys)
    .where(eq(tastingWhiskeys.id, tastingWhiskeyId))
    .returning({ tastingId: tastingWhiskeys.tastingId})
  return tastingId[0].tastingId
}

export async function selectWhiskeyForTasting(whiskeyId: string, tastingId: string, position: number) {
  const tastingWhiskey = await db.insert(tastingWhiskeys).values({
    tastingId: tastingId,
    whiskeyId: whiskeyId,
    position: position
  })
}
