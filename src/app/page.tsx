import Image from "next/image";
import { currentUser } from '@clerk/nextjs';
import { getUpcomingTastings } from "./data-access/tastings"
import { TastingList } from "./tasting_list"
import { AddTastingSheet } from "./add_tasting_sheet"
import { getUser } from "./data-access/users";


export default async function Home() {

  const user = await currentUser();
  const tastings = await getUpcomingTastings()
  
  let admin = false
  if (user) {
    const localUser = await getUser(user.id)
    if (localUser) {
      admin = localUser.admin || false
    }
  }

  return (
    <main className="container w-full">
      <div className="hero w-full flex flex-row flex-1 h-64 border-2 border-stone-800 overflow-hidden">
        <h1 className="text-3xl font-semibold tracking-normal flex basis-1/2 justify-center items-center">Upcoming Tastings</h1>
        <Image src="/whiskey_1280_853.jpg" alt="Whiskey Glass" height="853" width="1280" priority={true} className="hidden lg:block basis-1/2 object-cover"/>
      </div>
      <TastingList tastings={tastings}/>
      
      {admin && (
      <div className="mt-6 mx-auto p-6">
        <AddTastingSheet/>
      </div>
      )}
    </main>
  );
}
