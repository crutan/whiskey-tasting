"use client"
import { UserRatingDTO } from "@/app/data-access/userRatings"
import { Card, CardContent } from "@/components/ui/card"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { updateUserRatingAction } from "@/app/actions/userRating_actions"


type RatingCardProps = {
  userRating: UserRatingDTO
}

const formSchema = z.object({
  id: z.string(),
  tastingId: z.string(),
  rating: z.string().transform(Number).refine((n) => (1 <= n && n <= 10), { message: "Rating must be between 1 and 10" }),
  tastingNotes: z.string(),
  nosingNotes: z.string(),
})

export const RatingCard = ({ userRating }: RatingCardProps) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: userRating.id,
      tastingId: userRating.tastingId,
      tastingNotes: userRating.tastingNotes,
      nosingNotes: userRating.nosingNotes,
      rating: Number(userRating.rating)
    }
  })

  const handleSubmit = async (evt: z.infer<typeof formSchema>) => {
    console.log(evt)
    toast({
      duration: 1000,
      title: "Saved Rating",
      description: `You rated whiskey # ${userRating.position} a ${evt.rating}`,
    })
    userRating.rating = evt.rating.toString()
    userRating.tastingNotes = evt.tastingNotes
    userRating.nosingNotes = evt.nosingNotes
    await updateUserRatingAction(userRating)
  }

  return (
    <div className="p-1">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h1 className="text-xl font-semibold">Whiskey # {userRating.position}</h1>
          <Form {...form }>
            <form onSubmit={form.handleSubmit(handleSubmit)}
              className="max-w-mw w-full flex flex-col gap-6">
              <FormField name="rating" control={form.control} render={({ field }) =>(
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} required />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField name="nosingNotes" control={form.control} render={({ field }) =>(
                <FormItem>
                  <FormLabel>Nosing Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Smells like whiskey..." {...field} />
                  </FormControl>
                </FormItem>
              )}
              />
              <FormField name="tastingNotes" control={form.control} render={({ field }) =>(
                <FormItem>
                  <FormLabel>Tasting Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tastes like whiskey..." {...field} />
                  </FormControl>
                </FormItem>
              )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}