"use client"
import { markTastingStateSignupAction, markTastingStateSetupAction } from "@/app/actions/tasting_actions"
import { TastingDTO } from "@/app/data-access/tastings"
import { Button } from "@/components/ui/button"
import * as React from "react"

type SignupToggleProps = {
  tasting: TastingDTO
}
export const SignupToggle = ({ tasting }: SignupToggleProps) => {

  const toggleReady = async(value: boolean) => {
    console.log("in toggle ready: ", value)
    if (value === true) {
      await markTastingStateSignupAction(tasting.id)

    } else {
      await markTastingStateSetupAction(tasting.id)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {tasting.state === 'signup' && (
        <div>
          <h3 className="text-xl font-semibold tracking-normal">Turn off Signup</h3>
          <Button onClick={() => toggleReady(false)}>Not Ready For Signup</Button>
        </div>
        )}
        {tasting.state === 'setup' && (
          <div>
            <h3 className="text-xl font-semibold tracking-normal">Mark Tasting Ready For Signup</h3>
            <Button onClick={() => toggleReady(true)}>Ready For Signup</Button>
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