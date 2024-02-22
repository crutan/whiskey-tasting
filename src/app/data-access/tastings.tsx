import { db } from '@/db'
import { tastings, tastingAttendees, tastingWhiskeys, Tasting, tastingStateEnum, userRatings, users } from '@/db/schema';
import { and, asc, eq, gte, sql } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs';
export type TastingDTO = {
  id: string
  name: string
  description: string
  date: Date
  blind: boolean
  hostId: string
  flights: number
  state: string
}

export function dbToDTO(db: Tasting) {
  const dto: TastingDTO = {
    id: db.id,
    name: db.name,
    description: db.description || '',
    date: db.date ? new Date(db.date) : new Date(),
    blind: db.blind || false,
    hostId: db.hostId || '',
    flights: db.flights || 1,
    state: db.state
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
    hostId: user?.id,
    flights: tastingData.flights
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
      flights: tastingData.flights
    })
    .where(eq(tastings.id, tastingData.id))
}

export async function markTastingStateSignup(tastingId: string) {
  await db.update(tastings).set({ state: 'signup' }).where(eq(tastings.id, tastingId))
}

export async function markTastingStateSetup(tastingId: string) {
  await db.update(tastings).set({ state: 'setup' }).where(eq(tastings.id, tastingId))
}

export async function markTastingStateStarted(tastingId: string) {
  console.log("Start tasting in db")
  await db.update(tastings).set({ state: 'started' }).where(eq(tastings.id, tastingId))
}

export async function markTastingStateFinished(tastingId: string) {
  await db.update(tastings).set({ state: 'finished' }).where(eq(tastings.id, tastingId))
}


export async function attendTasting(tastingId: string) {
  const user = await currentUser();
  if(!user) { return false }
  await db.insert(tastingAttendees).values( { tastingId: tastingId, userId: user.id })
  .onConflictDoNothing();

  const tws = await db.query.tastingWhiskeys.findMany({
    where: eq(tastingWhiskeys.tastingId, tastingId)
  })
  const userId: string = user.id
  const inserts = tws.map((tw) => {
    let newRating: typeof userRatings.$inferInsert = {
      userId: userId,
      tastingId: tastingId,
      tastingWhiskeyId: tw.id,
      whiskeyId: tw.whiskeyId,
      flight: tw.flight || 1,
      position: tw.position || 1,
    }
    return newRating
  })
  await db.insert(userRatings).values(inserts)
}

export async function checkAttendence(tastingId: string, userId: string) {
  const result = await db.select().from(tastingAttendees).where(
    and(
      eq(tastingAttendees.userId, userId),
      eq(tastingAttendees.tastingId, tastingId)
    )
  )
  return result 
}

export async function getAttendees(tastingId: string) {
  const result = await db.selectDistinct({id: users.id, firstName: users.firstName, lastName: users.lastName}).from(users).leftJoin(userRatings, eq(users.id, userRatings.userId)).where(eq(userRatings.tastingId, tastingId))
  return result
}

export async function getTastingMatrix(tastingId: string) {
  const result = await db.query.userRatings.findMany({
    where: eq(userRatings.tastingId, tastingId),
    with: {
      user: true,
      whiskey: true,
    },
    orderBy: [asc(userRatings.position)] 


  })
  let resultArray = []
  for (let i=1; i <= Math.max.apply(Math, result.map((r) => r.position)); i++) {
    resultArray[i] = result.filter((r) => r.position === i)
  }
  return resultArray
}