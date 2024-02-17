import { db } from '@/db'
import { tastings, whiskeys, tastingWhiskeys, Tasting } from '@/db/schema';
import { asc, eq, gte, sql } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs';
export type TastingDTO = {
  id: string
  name: string
  description: string
  date: Date
  blind: boolean
  hostId: string
}

export function dbToDTO(db: Tasting) {
  const dto: TastingDTO = {
    id: db.id,
    name: db.name,
    description: db.description || '',
    date: db.date ? new Date(db.date) : new Date(),
    blind: db.blind || false,
    hostId: db.hostId || ''
  }
  return dto;
}

export async function getTasting(id: string) {
  const tasting = await db.query.tastings.findFirst({ 
    where: eq(tastings.id, id),
    with: {
      tastingWhiskeys: {
        with: {
          whiskey: true,
        }
      }
    }
  })
  if (tasting) {
    const dto = dbToDTO(tasting)
    return dto
  }
  return null
}

export async function getUpcomingTastings() {
  return db.query.tastings.findMany({ 
    where: sql`date >= CURRENT_DATE`,
    orderBy: [asc(tastings.date)] 
  }) 
}

export async function createTasting(tastingData : Omit<TastingDTO, 'id'>): Promise<string> {
  const user = await currentUser();
  const newTasting = await db.insert(tastings).values({
    name: tastingData.name,
    description: tastingData.description,
    blind: tastingData.blind,
    date: tastingData.date.toISOString(),
    hostId: user?.id
  }).returning({ insertedId: tastings.id })
  return newTasting[0].insertedId;
}

export async function updateTasting(tastingData: TastingDTO) {
  console.log("Running the ORM update: ", tastingData)
  await db.update(tastings)
    .set({
      name: tastingData.name,
      description: tastingData.description,
      blind: tastingData.blind,
      date: tastingData.date.toISOString(),
    })
    .where(eq(tastings.id, tastingData.id))
}
