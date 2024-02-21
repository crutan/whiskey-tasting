"use server"

import { attendTasting, checkAttendence, createTasting, markTastingStateSetup, markTastingStateSignup, markTastingStateStarted, updateTasting } from "@/app/data-access/tastings"
import { TastingDTO } from "../data-access/tastings"
import { revalidatePath } from "next/cache"
import { redirect } from 'next/navigation'


export async function createTastingAction(formData: Omit<TastingDTO, 'id'>) {
  const newTasting = await createTasting(formData)
  revalidatePath('/')
  redirect(`/tastings/${newTasting}`) // Navigate to the new post page
}

export async function updateTastingAction(formData: TastingDTO) {
  await updateTasting(formData)
  revalidatePath(`/tastings/${formData.id}`)
}

export async function markTastingStateSignupAction(tastingId: string): Promise<void> {
  await markTastingStateSignup(tastingId)
  revalidatePath(`/tastings/${tastingId}`)

}

export async function markTastingStateSetupAction(tastingId: string): Promise<void> {
  await markTastingStateSetup(tastingId)
  revalidatePath(`/tastings/${tastingId}`)
}

export async function startTastingAction(tastingId: string): Promise<void> {
  console.log("Start action")
  await markTastingStateStarted(tastingId)
  redirect(`/tastings/${tastingId}/running`)
}

export async function checkAttendenceAction(tastingId: string, userId: string): Promise<boolean> {
  const result = await checkAttendence(tastingId, userId)
  return result.length === 1 ? true : false
}

export async function attendTastingAction(tastingId: string): Promise<void> {
  const result = await attendTasting(tastingId)
}

export async function redirectToRate(tastingId: string) {
  redirect(`/tastings/${tastingId}/rate`)
}