"use server"

import { attendTasting, checkAttendence, createTasting, markTastingStateSetup, markTastingStateSignup, markTastingStateStarted, updateTasting } from "@/app/data-access/tastings"
import { TastingDTO } from "../data-access/tastings"
import { revalidatePath } from "next/cache"
import { redirect } from 'next/navigation'
import { UserRatingDTO, updateUserRating } from "../data-access/userRatings"

export async function updateUserRatingAction(userRating: UserRatingDTO) {
  await updateUserRating(userRating)
}