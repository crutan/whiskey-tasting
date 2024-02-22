"use client"
import Image from "next/image"

import { Card, CardContent } from '@/components/ui/card'
import { UserRatingWithWhiskeyandUser } from '@/types'
import { TastingDTO } from "@/app/data-access/tastings"
import { User } from "@clerk/nextjs/server"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"


type AttendeeCompleteProps = {
  matrix: UserRatingWithWhiskeyandUser[][]
  tasting: TastingDTO
  userId: string
}

type WhiskeyTableRowProps = {
  rowData: UserRatingWithWhiskeyandUser[]
  userId: string
  min: number
  max: number
}

const WhiskeyTableRow = ( { rowData, userId, min, max }: WhiskeyTableRowProps ) => {
  const myRow = rowData.filter((r) => r.userId === userId)[0]
  let style = ''
  if (Number(myRow.rating) === min) {
    style = 'bg-red-200'
  } else if (Number(myRow.rating) === max) {
    style = 'bg-green-200'
  }

  return (
    <TableRow className={cn(style)}>
      <TableCell>{myRow.position}</TableCell>
      <TableCell>
        {myRow.whiskey.distillery} {myRow.whiskey.name}
      </TableCell>
      <TableCell>{myRow.whiskey.mashBill}</TableCell>
      <TableCell>{myRow.whiskey.ageStatement}</TableCell>
      <TableCell>{myRow.whiskey.abv} %</TableCell>
      <TableCell>{myRow.rating}</TableCell>
    </TableRow>
  )
}
export const AttendeeComplete = ({ matrix, tasting, userId }: AttendeeCompleteProps) => {

  if (tasting.state !== 'finished') {
    return (<div>This tasting has not finished yet.  Please return when it has.</div>)
  }

  const myRows = matrix.flat(1).filter((r) => r.userId == userId)
  const myRatings = myRows.map((r) => Number(r.rating))
  const minRating = Math.min.apply(null, myRatings)
  const maxRating = Math.max.apply(null, myRatings)

  return (
    <main className="container w-full">
      <div className="hero w-full flex flex-row flex-1 h-64 border-2 border-stone-800 overflow-hidden">
        <div className="flex flex-col basis-full lg:basis-1/2 justify-center items-center">
        <h1 className="text-3xl font-semibold tracking-normal ">You&apos;ve Tasted it All!</h1>
        </div>
        <Image src="/whiskey_1280_853.jpg" alt="Whiskey Glass" height="853" width="1280" priority={true} className="hidden lg:block basis-1/2 object-cover"/>
      </div>
      
      <div className="container mt-6 mx-auto p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Whiskey</TableHead>
              <TableHead>Mashbill</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>ABV</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

          {matrix.map((userRatings, i) => (
            <WhiskeyTableRow key={i} userId={userId} rowData={userRatings} min={minRating} max={maxRating}/>
          ))}
        </TableBody>
        </Table>
      </div>
    </main>
  )

}