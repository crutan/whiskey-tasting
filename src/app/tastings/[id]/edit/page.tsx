import Image from "next/image";
import { currentUser } from '@clerk/nextjs';
import { TastingDTO, getTasting } from "@/app/data-access/tastings"
import { getTastingWhiskeys } from "@/app/data-access/tastingWhiskeys"
import { EditTastingSheet } from "./edit_tasting_sheet"
import { TastingCard } from "@/app/tasting_card"
import { Separator } from "@/components/ui/separator"

import { TastingWhiskeyList } from "./tastingWhiskeyList";
import { getUnusedWhiskeys } from "@/app/data-access/whiskeys";
import { AddOrSelectWhiskeys } from "./addOrSelectWhiskey";
import { SignupToggle } from "./signupToggle";
import { StartTasting } from "./startTasting";

// const getCachedTasting = unstable_cache(
//   async (id) => getTasting(id),
//   [`tasting-editor`]
// );
// const getCachedWhiskeys = unstable_cache(
//   async (tasting_id) => getTastingWhiskeys(tasting_id),
//   [`whiskey-list`]
// );


export default async function Page({ params }: { params: { id: string } }) {
  const tasting: TastingDTO | null = await getTasting(params.id)
  const whiskeys = await getTastingWhiskeys(params.id)
  const availableWhiskeys = await getUnusedWhiskeys(params.id)
  const user = await currentUser();
  


  if (!tasting) {
    return (<div></div>)
  }


  
  return (
    <main className="container w-full">
    <div className="hero w-full flex flex-row flex-1 h-64 border-2 border-stone-800 overflow-hidden">
      <div className="flex flex-col basis-1/2 justify-center items-center">
      <h1 className="text-3xl font-semibold tracking-normal ">Edit Tasting</h1>
      </div>
      <Image src="/whiskey_1280_853.jpg" alt="Whiskey Glass" height="853" width="1280" priority={true} className="hidden lg:block basis-1/2 object-cover"/>
    </div>
    
    <div className="container mt-6 mx-auto p-6">
      <h3 className="text-xl font-semibold tracking-normal">Tasting Details:</h3>
      <TastingCard tasting={tasting} showFooter={false}/>
      <EditTastingSheet tasting={tasting} />

      <Separator className="my-8"/>

      <h3 className="text-xl font-semibold tracking-normal">Whiskeys:</h3>
      <TastingWhiskeyList tasting_whiskeys={whiskeys} tasting={tasting}/>

      <AddOrSelectWhiskeys tasting={tasting} availableWhiskeys={availableWhiskeys} tasting_whiskeys={whiskeys}/>

      <Separator className="my-8"/>

      {user?.id === tasting.hostId && tasting.state === "setup" && (
        <SignupToggle tasting={tasting}/>
      )}
      {user?.id === tasting.hostId && tasting.state === 'signup' && (
        <StartTasting tasting={tasting}/>
      )}
    </div>

    
  </main>
  )

}