import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const maxDuration = 300
export const revalidate = 0

export async function PUT(req: NextRequest){

    try {
        
        const session = await getServerSession(authOptions)

        if (session) {

            const searchParams = req.nextUrl.searchParams
            const contactId = searchParams.get('contactId')
            const groupId = searchParams.get('groupId')
            const action = searchParams.get('action')

            if (contactId) {

                if (groupId) {

                    if (action === 'add') {

                        const contact = await prisma.uPP_Contact.update({

                            where: {
                                id: contactId
                            },

                            data: {
                                groups: {
                                    connect: {
                                        id: groupId
                                    }
                                }
                            }
                        })
        
                        return NextResponse.json(contact)

                    } else if (action === 'remove') {

                        const contact = await prisma.uPP_Contact.update({

                            where: {
                                id: contactId
                            },

                            data: {
                                groups: {
                                    disconnect: {
                                        id: groupId
                                    }
                                }
                            }
                        })
        
                        return NextResponse.json(contact)

                    } else {
                        throw new Error("Incorrect action provided")
                    }


                } else {
                    throw new Error('No group Id provided')
                }
                
            }  else {
                throw new Error('No contact id provided')
            }

        } else {
            throw new Error('User not signed in')
        }

    } catch (error) {
        return NextResponse.json(error)
    }

}