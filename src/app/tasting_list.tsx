import * as React from "react"
import type { Tasting } from '@/db/schema'
import { TastingCard } from "./tasting_card"

export type TastingListProps = {
  tastings: Tasting[]
}

export const TastingList = ( { tastings }: TastingListProps  ): JSX.Element => {
  return (
    <ol className="list-decimal">
    {tastings.map((tasting) => (
      <div key={tasting.id}>
        <TastingCard tasting={tasting} />
      </div>
    ))}
    </ol>
  )
}