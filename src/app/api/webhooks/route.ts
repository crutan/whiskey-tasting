import { Webhook } from 'svix'
import { headers } from  'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
//import { Prisma, PrismaClient } from '@prisma/client'
import { userAgent } from 'next/server'

//const prisma = new PrismaClient()
import { eq, sql } from 'drizzle-orm'

import { db } from '@/db'
import * as schema from '@/db/schema'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK SECRET from clerk dashboard to .env or .env.local')
  }

  // Get headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // get the body

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
 
  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
 
  if (!id) {
    return new Response('', { status: 200 })
  }

  // console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  // console.log('Webhook body:', body)
  if (eventType === 'user.created') {
    const { first_name, last_name } = evt.data
    const adminUsers = await db.select().from(schema.users).where(eq(schema.users.admin, true))
    await db.insert(schema.users)
      .values( { id: id, firstName: first_name, lastName: last_name, admin: (adminUsers.length === 0 ? true : false) })
      .onConflictDoUpdate({
        target: schema.users.id, set: { firstName: first_name, lastName: last_name }
      })
  } else if (eventType === 'user.updated') {
    const { first_name, last_name } = evt.data
    await db.update(schema.users)
      .set({ firstName: first_name, lastName: last_name })
      .where(eq(schema.users.id, id))
    // const user = await prisma.user.update({
    //   where: { id: id },
    //   data: {
    //     first_name: first_name,
    //     last_name: last_name
    //   }
    // })
  } else if (eventType === 'user.deleted') {
    // await prisma.user.delete({
    //   where: {
    //     id: id
    //   }
    // })
    await db.delete(schema.users)
      .where(eq(schema.users.id, id))
  }
 
  return new Response('', { status: 200 })
}