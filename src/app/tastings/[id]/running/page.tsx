import * as React from 'react'
import Image from 'next/image'
import { getTastingWhiskeys } from '@/app/data-access/tastingWhiskeys'
import { TastingDTO, getTastingMatrix, getTasting } from '@/app/data-access/tastings'
import { UserRatingWithWhiskeyandUser } from '@/types'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { finishTastingAction } from '@/app/actions/tasting_actions'
import { currentUser } from '@clerk/nextjs'
import { FinishTasting } from './finishTasting'

type WhiskeyTableRowProps = {
  rowData: UserRatingWithWhiskeyandUser[]
  nextRow: UserRatingWithWhiskeyandUser[]
}

const WhiskeyTableRow = ( { rowData, nextRow }: WhiskeyTableRowProps ) => {
  const completedRatings = rowData.filter((e) => {return e.rating && Number(e.rating) > 0})
  const uncompleteRatings = rowData.filter((e) => {return Number(e.rating) === 0})
  const complete = uncompleteRatings.length === 0
  const averageRating = completedRatings.length > 0 ? completedRatings.reduce((a,cV) => a + Number(cV.rating), 0) / completedRatings.length : 0
  const styles = cn((complete ? 'bg-green-200' : 'bg-slate-50'), (nextRow && nextRow[0].flight !== rowData[0].flight ? 'border-b-4 border-b-slate-700' : ''))
  return (
    <TableRow className={styles}>
      <TableCell>{rowData[0].flight}</TableCell>
      <TableCell>{rowData[0].whiskey.distillery} {rowData[0].whiskey.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        <ol>
          {completedRatings.map((r) => (
            <li key={r.id}>{r.user.firstName} {r.user.lastName}: {r.rating}</li>
          ))}
        </ol>
      
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <ol>
          {uncompleteRatings.map((r) => (
            <li key={r.id}>{r.user.firstName} {r.user.lastName}</li>
          ))}
        </ol>
      </TableCell>
      <TableCell className="table-cell lg:hidden">{completedRatings.length} / {uncompleteRatings.length}</TableCell>
      <TableCell>{averageRating}</TableCell>
    </TableRow>
  )
}


export default async function Page({ params }: { params: { id: string } }) {
  const tasting: TastingDTO | null = await getTasting(params.id)
  const matrix: UserRatingWithWhiskeyandUser[][] = await getTastingMatrix(params.id)
  const user = await currentUser()

  if (!tasting) {
    return (<div>Not found</div>)
  }

  if (user && tasting.hostId !== user.id) {
    return (<div>Not Permitted</div>)
  }



  return (
    <main className="container w-full">
      <div className="hero w-full flex flex-row flex-1 h-24 lg:h-64 border-2 border-stone-800 overflow-hidden">
        <div className="flex flex-col basis-full lg:basis-1/2 justify-center items-center">
        <h1 className="text-3xl font-semibold tracking-normal ">Running The Tasting</h1>
        </div>
        <Image src="/whiskey_1280_853.jpg" alt="Whiskey Glass" height="853" width="1280" priority={true} className="hidden lg:block basis-1/2 object-cover"/>
      </div>
      
      <div className="container mt-6 mx-auto p-6">
        <Table>
          <TableCaption>Progress in this tasting</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Flight</TableHead>
              <TableHead>Whiskey</TableHead>
              <TableHead className="hidden md:table-cell">Ratings Complete</TableHead>
              <TableHead className="hidden md:table-cell">Ratings Incomplete</TableHead>
              <TableHead className="table-cell md:hidden">C/I</TableHead>
              <TableHead>Average Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
        {matrix.map((e, i, a) => (
          <WhiskeyTableRow key={i} rowData={e} nextRow={a[i+1]}/>
        ))}
          </TableBody>
        </Table>
        <Separator/>
        <h3 className="text-xl font-semibold">Finish Tasting</h3>
        <FinishTasting tasting={tasting}/>
      </div>
    </main>
  )
}