"use client"
import * as React from "react"
import type { TastingWhiskeyWithWhiskey } from '@/types'
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import { TastingDTO } from "../../../data-access/tastings"
import { reOrderTastingWhiskeyAction, removeTastingWhiskeyAction } from "../../../actions/tastingWhiskey_actions"
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd'
import type { Identifier } from 'dnd-core'


export type WhiskeyTableProps = {
  tasting: TastingDTO
  tasting_whiskeys: Array<TastingWhiskeyWithWhiskey>
}

type WhiskeyRowProps = {
  tw: TastingWhiskeyWithWhiskey
}

interface DragItem {
  id: string
  position?: number
  handlerId?: string
}

const WhiskeyRow = ( { tw }: WhiskeyRowProps ) => {
  const removeTastingWhiskey = async (tastingWhiskeyId: string) => {
    await removeTastingWhiskeyAction(tastingWhiskeyId);
  }

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
		// "type" is required. It is used by the "accept" specification of drop targets.
    type: 'WhiskeyRow',
		// The collect function utilizes a "monitor" instance (see the Overview for what this is)
		// to pull important pieces of state from the DnD system.
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end(item: DragItem, monitor) {
      const droppedItem: DragItem | null = monitor.getDropResult()
      if (droppedItem && droppedItem.position && droppedItem.handlerId) {
        console.log("Dropped item: ", droppedItem)
        reOrderTastingWhiskeyAction(tw.tastingId, tw.id, droppedItem.handlerId, droppedItem.position)
      }
    },
    item: { id: tw.id },
  }))

  const [{ isOver }, drop] = useDrop({
		accept: 'WhiskeyRow',
    canDrop(item: DragItem, monitor) {
      return item.id !== tw.id
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    drop(item, monitor) {
      return { handlerId: tw.id, position: tw.position }
    },
  })
  const attachRef = (el: HTMLDivElement) =>{
    drag(el)
    drop(el)
  }

  return (
    <div key={tw.id} className="flex flex-row" role="Handle" ref={attachRef} data-position={tw.position} data-id={tw.id}>
    <div className="basis-16">{tw.position}</div>
    <div className="basis-1/3">{tw.whiskey?.distillery} {tw.whiskey?.name}</div>
    <div className="basis-1/6">{tw.whiskey?.ageStatement}</div>
    <div className="basis-1/6">{tw.whiskey?.abv}</div>
    <div className="basis-1/6">$ {tw.whiskey?.msrp}</div>
    <div className="basis-1/3">{tw.whiskey?.mashBill}</div>
    <div className="basis-16"><Button variant='destructive' onClick={() => removeTastingWhiskeyAction(tw.id)}><XCircle /></Button></div>
  </div>
  )
}

export const TastingWhiskeyList = ( { tasting, tasting_whiskeys }: WhiskeyTableProps ): JSX.Element => {



  return (
    <DndProvider backend={HTML5Backend}>

    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-row">
        <div className="basis-16">#</div>
        <div className="basis-1/3">Name</div>
        <div className="basis-1/6">Age</div>
        <div className="basis-1/6">ABV</div>
        <div className="basis-1/6">MSRP</div>
        <div className="basis-1/3">Mash Bill</div>
        <div className="basis-16"></div>
      </div>
      {tasting_whiskeys.map((tw) => (
        <WhiskeyRow tw={tw} key={tw.id}/>
      ))}
    </div>
    </DndProvider>
  )

}