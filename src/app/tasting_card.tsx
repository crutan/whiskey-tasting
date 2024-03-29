"use client"
import * as React from "react"
import type { TastingDTO } from "./data-access/tastings"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { useAuth } from "@clerk/nextjs";
import { Tasting } from "@/db/schema"

export type TastingCardProps = {
  tasting: TastingDTO | Tasting
  showFooter?: boolean
}

export const TastingCard = ( { tasting, showFooter = true }: TastingCardProps ): JSX.Element => {
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tasting.name}</CardTitle>
        {tasting.date !== null && tasting.date instanceof Date && (
          <CardDescription>{tasting.date.toISOString()}</CardDescription>
        )}
        {tasting.date !== null && tasting.date instanceof String && (
          <CardDescription>{tasting.date}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p>
          {tasting.description}
        </p>
        <p>
          This tasting will consist of {tasting.flights} flights
        </p>
      </CardContent>
      {showFooter && (
      <CardFooter>
        {userId && tasting.hostId === userId && (
          <Link href={`/tastings/${tasting.id}/edit`}><Button variant='secondary'>Edit</Button></Link>
        )}
        {tasting.state === 'signup' && (
          <Link href={`/tastings/${tasting.id}`}><Button>Sign Up for the Tasting</Button></Link>
        )}
        {tasting.state === 'started' && (
          <Link href={`/tastings/${tasting.id}/rate`}><Button>Go To the Tasting!</Button></Link>
        )}
      </CardFooter>
      )}
    </Card>
  )
}