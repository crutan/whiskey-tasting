import * as React from 'react'
import Image from 'next/image'
import { TastingDTO, getTasting } from '@/app/data-access/tastings'
import { getTastingWhiskeys } from '@/app/data-access/tastingWhiskeys'
import { currentUser } from '@clerk/nextjs'
import { getUserRatings } from '@/app/data-access/userRatings'
import { RatingsCarousel } from './carousel'



export default async function Page({ params }: { params: { id: string } }) {
  const tasting: TastingDTO | null = await getTasting(params.id)
  const ratings = await getUserRatings(params.id)

  if (!ratings) {
    return (<div>Not found</div>)
  }

  return (
    <main className="container w-full">
      <div className="hero w-full flex flex-row flex-1 h-64 border-2 border-stone-800 overflow-hidden">
        <div className="flex flex-col basis-full lg:basis-1/2 justify-center items-center">
        <h1 className="text-3xl font-semibold tracking-normal ">Enjoy the Tasting</h1>
        </div>
        <Image src="/whiskey_1280_853.jpg" alt="Whiskey Glass" height="853" width="1280" priority={true} className="hidden lg:block basis-1/2 object-cover"/>
      </div>
      
      <div className="container mt-6 mx-auto p-6">
        <RatingsCarousel ratings={ratings}/>          
      </div>
    </main>
  )
}