"use client"
import { markTastingStateSignupAction, startTastingAction } from "@/app/actions/tasting_actions"
import { TastingDTO } from "@/app/data-access/tastings"
import { Button } from "@/components/ui/button"
import * as React from "react"

type StartTastingProps = {
  tasting: TastingDTO
}
export const StartTasting = ({ tasting }: StartTastingProps) => {

  const toggleStart = async(value: boolean) => {
    console.log("Starting the tasting")
    if (value === true) {
      await startTastingAction(tasting.id)

    } else {
      await markTastingStateSignupAction(tasting.id)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {tasting.state === 'signup' && (
        <div>
          <h3 className="text-xl font-semibold tracking-normal">Start Your Tasting</h3>
          <Button onClick={() => toggleStart(true)}>Start</Button>
        </div>
        )}
        {tasting.state === 'setup' && (
          <div>
            <h3 className="text-xl font-semibold tracking-normal">Go back to Signup</h3>
            <Button onClick={() => toggleStart(false)}>Back to Signup</Button>
          </div>
        )}
        
        <div>
          <h3 className="text-xl font-semibold tracking-normal">Remove Tasting:</h3>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>
    </div>
  )
} 