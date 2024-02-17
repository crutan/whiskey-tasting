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
import { AddTastingForm } from "./add_tasting_form";
import { Button } from "@/components/ui/button";


export const AddTastingSheet = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Add Tasting</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Your Tasting</SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <AddTastingForm closeCallback={(state: boolean) => setOpen(state)}/>
    
      </SheetContent>
    </Sheet>
  )
}