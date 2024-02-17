"use server"

import { createTasting, updateTasting } from "../data-access/tastings"
import { TastingDTO } from "../data-access/tastings"
import { revalidatePath } from "next/cache"
import { redirect } from 'next/navigation'


export async function createTastingAction(formData: Omit<TastingDTO, 'id'>) {
  const newTasting = await createTasting(formData)
  revalidatePath('/')
  redirect(`/tastings/${newTasting}`) // Navigate to the new post page
}

export async function updateTastingAction(formData: TastingDTO) {
  console.log("Server action for updating tasting: ", formData)
  await updateTasting(formData)
  revalidatePath(`/tastings/${formData.id}`)
}