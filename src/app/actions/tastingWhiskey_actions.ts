"use server"

import { TastingWhiskeyDTO, addTastingWhiskey, getTastingWhiskeys, removeTastingWhiskey, selectWhiskeyForTasting, updateTastingWhiskeyFlight, updateTastingWhiskeyPosition } from "../data-access/tastingWhiskeys"
import { revalidatePath } from "next/cache"
import { WhiskeyDTO } from "@/app/data-access/whiskeys"



function arraymove(arr: Array<any>, fromIndex:number, toIndex:number) {
  if (toIndex >= arr.length) {
    var k = toIndex - arr.length + 1;
    while (k--) {
        arr.push(undefined);
    }
  } 
  arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
}

function array_move(arr: Array<any>, fromIndex:number, toIndex:number) {
  while (fromIndex < 0) {
    fromIndex += arr.length;
  }
  while (toIndex < 0) {
    toIndex += arr.length;
  }
  if (toIndex >= arr.length) {
      var k = toIndex - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
};

export async function selectWhiskeyForTastingAction(whiskeyId: string, tastingId: string, position: number) {
  await selectWhiskeyForTasting(whiskeyId, tastingId, position)
  revalidatePath(`/tastings/${tastingId}`)
}

export async function addTastingWhiskeyAction(whiskey: WhiskeyDTO, tastingId: string, position: number) {
  
  const newTasting = await addTastingWhiskey(whiskey, tastingId, position)
  revalidatePath(`/tastings/${tastingId}`)
}

export async function removeTastingWhiskeyAction(tastingWhiskeyId: string) {
  const tastingId = await removeTastingWhiskey(tastingWhiskeyId)
  await reOrderTastingWhiskeyAction(tastingId)
}

export async function reOrderTastingWhiskeyAction(tastingId: string, movingWhiskeyId?: string, droppedWhiskeyId?: string, to?: number) {
  let tastingWhiskeys = await getTastingWhiskeys(tastingId)
  if (movingWhiskeyId && droppedWhiskeyId && to) {
    const fromIndex = tastingWhiskeys.map(el => el.id).indexOf(movingWhiskeyId)
    const toIndex = tastingWhiskeys.map(el => el.id).indexOf(droppedWhiskeyId)
    array_move(tastingWhiskeys, fromIndex, toIndex)
  }
  tastingWhiskeys.forEach((el, i) => {
    updateTastingWhiskeyPosition(el.id, i+1)
  })
  revalidatePath(`/tastings/${tastingId}`)
}

export async function updateTastingWhiskeyFlightAction(id: string, flight: string) {
  await updateTastingWhiskeyFlight(id, Number(flight))
}