"use client"
import * as React from 'react'
import { finishTastingAction } from "@/app/actions/tasting_actions"
import { TastingDTO } from "@/app/data-access/tastings"
import { Button } from '@/components/ui/button'

type FinishTastingProps = {
  tasting: TastingDTO
}

export const FinishTasting = ({ tasting }: FinishTastingProps) => {

  const finishTasting = async () => {
    finishTastingAction(tasting.id)
  }

  return (
    <Button onClick={() => finishTasting()}>Finish Tasting</Button>
  )
}