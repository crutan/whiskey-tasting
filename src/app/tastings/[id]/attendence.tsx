"use client"
import { attendTastingAction } from '@/app/actions/tasting_actions'
import { TastingDTO } from '@/app/data-access/tastings'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'

type AttendenceProps = {
  tasting: TastingDTO
  attendence: boolean
}

export const Attendence = ({ tasting, attendence }: AttendenceProps) => {
  const [ attending, setAttending ] = useState(attendence)
  const attend = async () => {
    await attendTastingAction(tasting.id)
    setAttending(true)
  }

  if (attending) {
    if (tasting.state === 'started') {
      return (
        <div>
          <h3 className="text-xl font-semibold ">Attending!</h3>
          <p>
           This tasting has started.  <Link href={`/tastings/${tasting.id}/rate`}><Button>Go To the Tasting!</Button></Link>

          </p>  
        </div>
      )
    } else {
    return (
      <div>
        <h3 className="text-xl font-semibold ">Attending!</h3>
        <p>
          You are attending this tasting.  Come back here once the host starts things up and you&apos;ll be able to rate the whiskeys.
        </p>  
      </div>
    )
    }
  } else {
    return (
      <div>
        <Button onClick={() => attend()}>Attend Tasting</Button>
      </div>
    )
  }
}