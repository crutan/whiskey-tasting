"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { TastingDTO } from "@/app/data-access/tastings"
import { addTastingWhiskeyAction } from "@/app/actions/tastingWhiskey_actions"
import { TastingWhiskeyDTO } from "@/app/data-access/tastingWhiskeys"
import { WhiskeyDTO } from "@/app/data-access/whiskeys"

type AddWhiskeyProps = {
  tasting: TastingDTO
  position: number
}

const formSchema = z.object({
  name: z.string(),
  ageStatement: z.string(),
  abv: z.string(),
  msrp: z.string(),
  mashBill: z.string(),
  distillery: z.string(),
  tastingId: z.string(),
  position: z.number()
})

export const AddWhiskey = ({ tasting, position }: AddWhiskeyProps ) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      ageStatement: '',
      abv: '0',
      msrp: '0.00',
      mashBill: '',
      distillery: '',
      tastingId: tasting.id,
      position: position
    }
  })

  const handleSubmit = async (evt: z.infer<typeof formSchema>) => {
    const whiskey: WhiskeyDTO = {
      name: evt.name,
      distillery: evt.distillery,
      mashBill: evt.mashBill,
      ageStatement: evt.ageStatement,
      abv: `${evt.abv}`,
      msrp: `${evt.msrp}`
    }
    await addTastingWhiskeyAction(whiskey, evt.tastingId, evt.position)
    form.reset()
  }

  return (
    <div>
      <h4>Add Whiskey</h4>
      <Form {...form }>
      <form onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-mw w-full flex flex-row gap-1">
        <FormField name="distillery" control={form.control} render={({ field }) =>(
            <FormItem>
              <FormLabel className="px-4">Distillery</FormLabel>
              <FormControl>
                <Input placeholder="Jack Daniels" {...field} required/>
              </FormControl>
              <FormMessage/>
            </FormItem>
            
          )}
        />
        <FormField name="name" control={form.control} render={({ field }) =>(
            <FormItem>
              <FormLabel className="px-4">Name</FormLabel>
              <FormControl>
                <Input placeholder="Old # 7" {...field} required/>
              </FormControl>
              <FormMessage/>
            </FormItem>
            
          )}
        />
        <FormField name="ageStatement" control={form.control} render={({ field }) => (
          <FormItem className="w-1/4">
            <FormLabel className="px-4">Age Statement</FormLabel>
            <FormControl>
              <Input placeholder="A blend of 6, 7" {...field } />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}/>
        <FormField name="abv" control={form.control} render={({ field }) => (
          <FormItem className="w-20">
            <FormLabel className="px-4">ABV</FormLabel>
            <FormControl>
              <Input placeholder="40" {...field } required/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}/>
        <FormField name="msrp" control={form.control} render={({ field }) => (
          <FormItem className="w-32">
            <FormLabel className="px-4">Price (USD)</FormLabel>
            <FormControl>
              <Input placeholder="35.00" {...field } required/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}/>

        <FormField name="mashBill" control={form.control} render={({ field }) =>(
            <FormItem className="w-1/4">
              <FormLabel className="px-4">Mash Bill (if known)</FormLabel>
              <FormControl>
                <Input placeholder="51% corn, 39% malted barley, 10% rye" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
            
          )}
        />
        <Button type="submit">Add</Button>
      </form>
      </Form>
    </div>
    
  )
}