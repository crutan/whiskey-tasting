"use client"
import * as React from "react"
import type { Whiskey } from "@/db/schema"
import { TastingDTO } from "@/app/data-access/tastings"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { AddWhiskey } from "./add_whiskey"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { addTastingWhiskeyAction, selectWhiskeyForTastingAction } from "@/app/actions/tastingWhiskey_actions"
import { TastingWhiskeyWithWhiskey } from "@/types"

type AddOrSelectWhiskeyProps = {
  availableWhiskeys: Whiskey[]
  tasting: TastingDTO
  tasting_whiskeys: TastingWhiskeyWithWhiskey[]
}

export const AddOrSelectWhiskeys = ({ availableWhiskeys, tasting, tasting_whiskeys }: AddOrSelectWhiskeyProps) => {
  const [whiskeys, setWhiskeys] = useState(availableWhiskeys)

  useEffect(() => {
    setWhiskeys(availableWhiskeys)
  }, [availableWhiskeys, tasting_whiskeys])
  const [filter, setFilter] = useState('')
  const position = tasting_whiskeys.length + 1
  const filterChange = (text: string) => {
    setFilter(text)
    setWhiskeys(availableWhiskeys.filter((whiskey) => 
      (whiskey.name.toLowerCase().includes(filter.toLowerCase()) 
      || whiskey.distillery.toLowerCase().includes(filter.toLowerCase()) 
      || tasting_whiskeys.find(el => el.whiskeyId === whiskey.id) !== null
      || filter === '')
      )
    )
  }

  const addWhiskey = async (whiskey: Whiskey) => {
    await selectWhiskeyForTastingAction(whiskey.id, tasting.id, position)
    filterChange('')
  }
  return (
    <div>
      <div className="flex flex-col w-full gap-4">
        { whiskeys.length > 0 && (
        <Input name="filter" onChange={(e) => filterChange(e.target.value)}/>
        )}
        {whiskeys.map((whiskey) => (
          <div key={whiskey.id} className="flex flex-row">
                <div className="basis-1/3">{whiskey.distillery} {whiskey.name}</div>
                <div className="basis-1/6">{whiskey.ageStatement}</div>
                <div className="basis-1/6">{whiskey.abv}</div>
                <div className="basis-1/6">$ {whiskey.msrp}</div>
                <div className="basis-1/3">{whiskey.mashBill}</div>
                <div className="basis-16"><Button onClick={() => addWhiskey(whiskey)}><PlusCircle /></Button></div>
              </div>
          ))  
        }
        {whiskeys.length === 0 &&(
          <AddWhiskey tasting={tasting} position={position}/>
        )}
      </div>
    </div>
  )
}