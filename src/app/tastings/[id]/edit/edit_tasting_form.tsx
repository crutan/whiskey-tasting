"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TastingDTO } from "@/app/data-access/tastings"
import { updateTastingAction } from "@/app/actions/tasting_actions"

const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  blind: z.boolean(),
  date: z.date(),
  flights: z.number()
})

type EditTastingFormProps = {
  tasting: TastingDTO
  closeCallback: (arg0: boolean) => void
}

export const EditTastingForm = ({ closeCallback, tasting }: EditTastingFormProps ) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: tasting.id,
      name: tasting.name,
      description: tasting.description,
      blind: tasting.blind,
      date: tasting.date,
      flights: tasting.flights
    }
  })

  const handleSubmit = async (evt: z.infer<typeof formSchema>) => {
    console.log(evt)
    await updateTastingAction(evt as TastingDTO)
    closeCallback(false)
  }

  return (
    <div>
    <Form {...form }>
      <form onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-mw w-full flex flex-col gap-6">
        <FormField name="name" control={form.control} render={({ field }) =>(
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My amazing tasting" {...field} required/>
              </FormControl>
              <FormMessage/>
            </FormItem>
            
          )}
        />
        <FormField name="description" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="describe your tasting" {...field } required/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}/>
        <FormField name="blind" control={form.control} render={({field}) => (
          <FormItem>
            <FormLabel>Blind Tasting?</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange}/>
            </FormControl>
          </FormItem>
        )}/>
        <FormField name="flights" control={form.control} render={({field}) => (
          <FormItem>
            <FormLabel>Number of Flights</FormLabel>
            <FormControl>
              <Input type="number" placeholder="1" {...field} required onChange={event => field.onChange(+event.target.value)}/>
            </FormControl>
            <FormMessage/>

          </FormItem>
        )}/>
        <FormField name="date" control={form.control} render={({field}) => (
          <FormItem className="flex flex-col">
              <FormLabel>Date of Tasting</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
        )}/>
        <Button className="w-full" type="submit">Submit</Button>
      </form>
    </Form>
    <Button className="w-full mt-4" variant="secondary" onClick={() => closeCallback(false)}>Cancel</Button>
    </div>
  )
}