import * as React from 'react'
import { TastingDTO, attendTasting, getTasting } from '@/app/data-access/tastings'
import { getTastingWhiskeys } from '@/app/data-access/tastingWhiskeys'
import Image from "next/image";
import { currentUser } from '@clerk/nextjs';
import { attendTastingAction, checkAttendenceAction, redirectToRate } from '@/app/actions/tasting_actions';
import { Attendence } from './attendence';


export default async function Page({params}: { params: { id: string}}) {
  const tasting: TastingDTO | null = await getTasting(params.id)
  const whiskeys = await getTastingWhiskeys(params.id)
  const user = await currentUser();

  if (!tasting) {
    return (<div>Not Found</div>)
  }

  if (!user) {
    return (<div>Please Log In</div>)
  }

  console.log('tasting stte: ', tasting.state)
  if (tasting.state === 'started') {
    redirectToRate(tasting.id)
  }

  const attendence = await checkAttendenceAction(tasting.id, user.id)

  return (
    <main className="container w-full">
    <div className="hero w-full flex flex-row flex-1 h-64 border-2 border-stone-800 overflow-hidden">
      <div className="flex flex-col basis-1/2 justify-center items-center">
      <h1 className="text-3xl font-semibold tracking-normal ">{tasting.name}</h1>
      <h3>{tasting.date.toDateString()}</h3>
      </div>
      <Image src="/whiskey_1280_853.jpg" alt="Whiskey Glass" height="853" width="1280" priority={true} className="basis-1/2 object-cover"/>
    </div>
    
    <div className="container mt-6 mx-auto p-6 flex flex-col gap-4">
      <div className="w-2/3">
        <h4 className="text-xl font-semibold">Description: </h4>
        <p>{tasting.description}</p>
      </div>

      {tasting.blind && (
        <div className="w-2/3">
          <h4 className="text-xl font-semibold">Blind Tasting</h4>
          <p>This is a blind tasting.  It consists of {whiskeys.length} whiskeys - but you won&apos;t know what they are until the tasting is complete.  You will sip and score them without knowing anything about them other than what your senses can tell you.</p>
        </div>
      )}

      {user.id !== tasting.hostId && (
        <div>
        <Attendence tasting={tasting} attendence={attendence} />
        </div>
      )}
    </div>


    </main>
  )
}