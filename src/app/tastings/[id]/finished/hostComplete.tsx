"use client"
import Image from "next/image"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from '@/components/ui/card'
import { UserRatingWithWhiskeyandUser } from '@/types'
import { TastingDTO } from "@/app/data-access/tastings"
import { cn } from "@/lib/utils"


type HostCompleteProps = {
  matrix: UserRatingWithWhiskeyandUser[][]
  tasting: TastingDTO
}

type WhiskeyCarouselContentProps = {
  rowData: UserRatingWithWhiskeyandUser[]
}

const WhiskeyCarouselContent = ( { rowData }: WhiskeyCarouselContentProps ) => {

  const maxRating = Math.max.apply(null, rowData.map((r) => Number(r.rating)))
  const minRating = Math.min.apply(null, rowData.map((r) => Number(r.rating)))

  const rowClass = (r: UserRatingWithWhiskeyandUser) => {
    console.log(" Looking at ", r)
    if (maxRating === minRating) {
      return ''
    }
    if (Number(r.rating) === maxRating) {
      return 'bg-green-200'
    }
    if (Number(r.rating) == minRating) {
      return 'bg-red-200'
    }
  }

  return (
    <CarouselItem>
      <div className="p-1">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="w-full justify-start flex flex-col">
              <div className="flex flex-row">
                <div className="flex font-bold px-4">Whiskey:</div>
                <div className="flex">{rowData[0].whiskey.distillery} {rowData[0].whiskey.name}</div>
              </div>
              <div className="flex flex-row">
                <div className="flex font-bold px-4">Mashbill:</div>
                <div className="flex">{rowData[0].whiskey.mashBill}</div>
              </div>
              <div className="flex flex-row">
                <div className="flex font-bold px-4">Age:</div>
                <div className="flex">{rowData[0].whiskey.ageStatement}</div>
              </div>
              <div className="flex flex-row">
                <div className="flex font-bold px-4">ABV:</div>
                <div className="flex">{rowData[0].whiskey.abv} %</div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Taster</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowData.map((r) => (
                  <TableRow key={r.id} className={cn(rowClass(r))}>
                    <TableCell>{r.user.firstName} {r.user.lastName}</TableCell>
                    <TableCell>{r.rating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
    )

}

export const HostComplete = ({ matrix, tasting }: HostCompleteProps) => {

  if (tasting.state !== 'finished') {
    return (<div>This tasting has not finished yet.  Please return when it has.</div>)
  }

  return (
    <main className="container w-full">
      <div className="hero w-full flex flex-row flex-1 h-64 border-2 border-stone-800 overflow-hidden">
        <div className="flex flex-col basis-full lg:basis-1/2 justify-center items-center">
        <h1 className="text-3xl font-semibold tracking-normal ">Your Tasting is Finished!</h1>
        </div>
        <Image src="/whiskey_1280_853.jpg" alt="Whiskey Glass" height="853" width="1280" priority={true} className="hidden lg:block basis-1/2 object-cover"/>
      </div>
      
      <div className="container mt-6 mx-auto p-6">
      <Carousel className="w-full" opts={{ loop: false }}>
        <CarouselContent>
          {matrix.map((e,i) => (
            <WhiskeyCarouselContent rowData={e} key={i} />
          ))}
        </CarouselContent>
        <CarouselPrevious/>
        <CarouselNext/>
      </Carousel>
      </div>
    </main>
  )

}