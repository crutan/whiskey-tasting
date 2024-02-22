import * as React from 'react'
import Image from 'next/image'
import { TastingDTO, getTasting, getTastingMatrix } from '@/app/data-access/tastings'
import { getTastingWhiskeys } from '@/app/data-access/tastingWhiskeys'
import { currentUser } from '@clerk/nextjs'
import { getUserRatings } from '@/app/data-access/userRatings'
import { UserRatingWithWhiskeyandUser } from '@/types'
import { AttendeeComplete } from './attendeeComplete'
import { HostComplete } from './hostComplete'

export default async function Page({ params }: { params: { id: string } }) {
  const tasting: TastingDTO | null = await getTasting(params.id)
  const matrix: UserRatingWithWhiskeyandUser[][] = await getTastingMatrix(params.id)
  const user = await currentUser()

  if (!tasting) {
    return (<div>Not found</div>)
  }

  if (user && tasting.hostId === user.id) {
    return (<HostComplete tasting={tasting} matrix={matrix}/>)
  }

  if (user && tasting.hostId !== user.id) {
    return (<AttendeeComplete tasting={tasting} matrix={matrix} userId={user.id} />)
  }

  return (
    <main>
      Error
    </main>
  )
}