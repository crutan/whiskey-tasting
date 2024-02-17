"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { EditTastingForm } from "./edit_tasting_form";
import { TastingDTO } from "@/app/data-access/tastings";
import { Button } from "@/components/ui/button";

type EditTastingSheetProps = {
  tasting: TastingDTO
}

export const EditTastingSheet = ({ tasting }: EditTastingSheetProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='secondary'>Edit</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Your Tasting</SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <EditTastingForm tasting={tasting} closeCallback={(state: boolean) => setOpen(state)}/>
    
      </SheetContent>
    </Sheet>
  )
}