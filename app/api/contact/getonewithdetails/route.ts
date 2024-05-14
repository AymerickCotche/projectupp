import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const maxDuration = 60
export const revalidate = 0

export async function GET(req: NextRequest){

    try {
        
        const session = await getServerSession(authOptions)

        if (session) {

            const searchParams = req.nextUrl.searchParams
            const contactId = searchParams.get('contactId')

            if (contactId) {

                const contact = await prisma.uPP_Contact.findUnique({
                    where: {
                      id: contactId,
                    },
                    include: {
                      demandes: true,
                      groups: {
                        include: {
                          campaigns: {
                            include: {
                              events: {
                                include: {
                                  eventContacts: {
                                    where: {
                                      contactId
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }  
                    }
                })

                return NextResponse.json(contact)

            } else {
                throw new Error('No contact email or contact id provided')
            }

        } else {
            throw new Error('User not signed in')
        }

    } catch (error) {
        return NextResponse.json(error)
    }

}