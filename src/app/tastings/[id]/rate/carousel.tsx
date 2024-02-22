"use client"
import Link from "next/link"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { RatingCard } from './ratingCard'
import { Card, CardContent } from '@/components/ui/card'
import useEmblaCarousel from 'embla-carousel-react'
import { UserRatingDTO } from "@/app/data-access/userRatings"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"

type CarouselProps = {
  ratings: UserRatingDTO[]
}

export const RatingsCarousel = ({ ratings }: CarouselProps) => {
  const [api, setApi] = useState<CarouselApi>()

   const afterSave = () => {
    if (api) {
      console.log("Scrolling")
      api.scrollNext()
    }
   }


  return (
  <Carousel className="w-full" opts={{ loop: false }} setApi={setApi}>
  <CarouselContent>
    {ratings.map((rating) => (
      <CarouselItem key={rating.position}>
        <RatingCard userRating={rating} afterSave={afterSave}/>
      </CarouselItem>
    ))}
    <CarouselItem key="end">
      <div className="p-1">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
         
              <p>You&apos;ve finished rating the whiskey in this tasting.</p>
              <p>Once everyone else has, the host will mark the tasting complete, and you can go see everything you ranked.</p>
              <p><Link href={`/tastings/${ratings[0].tastingId}/finished`}><Button>See your data</Button></Link></p>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious/>
  </Carousel>
  )
}