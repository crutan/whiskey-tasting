import { db } from '@/db'
import { tastings, userRatings, UserRating, users, Whiskey } from '@/db/schema';
import { and, asc, eq, gte, sql } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs';
import type { UserRatingWithWhiskeyandUser } from '@/types';

export type UserRatingDTO = {
  id: string
  tastingId: string
  flight: number;
  position: number;
  rating: string;
  tastingNotes: string;
  nosingNotes: string;
  whiskey?: Whiskey
}

function dbToDTO(result: UserRating ) {
  const dto: UserRatingDTO = {
    id: result.id,
    tastingId: result.tastingId,
    flight: result.flight,
    position: result.position,
    rating: result.rating || '0',
    tastingNotes: result.tastingNotes || '',
    nosingNotes: result.nosingNotes || ''
  }
  return dto
}

function dbWithWhiskeyToDTO(result: UserRatingWithWhiskeyandUser) {
  const dto: UserRatingDTO = {
    id: result.id,
    tastingId: result.tastingId,
    flight: result.flight,
    position: result.position,
    rating: result.rating || '0',
    tastingNotes: result.tastingNotes || '',
    nosingNotes: result.nosingNotes || '',
    whiskey: result.whiskey
  }
  return dto
}

export async function updateUserRating(userRating: UserRatingDTO) {
  await db.update(userRatings)
    .set({ rating: userRating.rating, tastingNotes: userRating.tastingNotes, nosingNotes: userRating.nosingNotes })
    .where(eq(userRatings.id, userRating.id))
  return userRating
}
export async function getUserRatings(tastingId: string) {
  const user = await currentUser()
  if (!user) {
    return []
  }
  const tasting = await db.query.tastings.findFirst({ where: eq(tastings.id, tastingId)})
  if (tasting && tasting.blind) {
    const result = await db.query.userRatings
      .findMany({ 
        where: and(eq(userRatings.userId, user.id), eq(userRatings.tastingId, tastingId)), 
        orderBy: asc(userRatings.position)
      })
    return result.map((r) => dbToDTO(r))
  } else {
    const result = await db.query.userRatings.findMany({ 
      where: and(eq(userRatings.userId, user.id), eq(userRatings.tastingId, tastingId)),
      with: {
        whiskey: true,
        user: true
      }
    })
    return result.map((r) => dbWithWhiskeyToDTO(r))
  }
  
}