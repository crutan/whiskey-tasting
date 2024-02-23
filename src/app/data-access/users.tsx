import { db } from '@/db'
import { users } from '@/db/schema';
import { asc, eq, ne } from 'drizzle-orm'

export async function getAllUsers(except?: string) {
  if (except) {
    return db.query.users.findMany({
      where: ne(users.id, except),
      orderBy: [asc(users.lastName), asc(users.firstName)]
    })
  } else {
    return db.query.users.findMany({ orderBy: [asc(users.lastName), asc(users.firstName)]})
  }
}

export async function getUser(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id)})
}