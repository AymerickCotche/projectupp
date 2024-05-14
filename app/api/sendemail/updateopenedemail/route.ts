import { NextRequest, NextResponse } from 'next/server'

import prisma from "@/lib/prisma"

export const maxDuration = 60
export const revalidate = 0

export async function GET(req: NextRequest){

  try {

    const searchParams = req.nextUrl.searchParams
    const contactId = searchParams.get('contactId')
    const eventId = searchParams.get('openedEventId')
    const redirectUrl = searchParams.get('redirect')

    if (contactId && eventId) {

    const foundEntry = await prisma.uPP_ContactEvents.findUnique({
      where: {
        contactId_eventId: {
          eventId,
          contactId
        }
      }
    })

    if (!foundEntry) {

      await prisma.uPP_ContactEvents.create({
        data: {
          eventId,
          contactId,
          counter: 1
        },
      })
    } else {
      await prisma.uPP_ContactEvents.update({
        where: {
          contactId_eventId: {
            eventId,
            contactId
          }
        },
        data: {
          counter: {
            increment: 1
          }
        }
      })
    }
    if (redirectUrl) {
      return NextResponse.redirect(redirectUrl)
    }
        
    return NextResponse.json('done')
        
    } else {
      throw new Error("No campaign Id provided")
    }   

  } catch (error) {
    return NextResponse.json(error)
  }
}