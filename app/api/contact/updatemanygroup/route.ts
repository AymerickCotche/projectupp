import { NextRequest, NextResponse } from 'next/server'

import prisma from "@/lib/prisma"

export const maxDuration = 300
export const revalidate = 0

interface Group {
    id: string
    nom: string
}

export async function PUT(req: NextRequest){

    try {

        const body = await req.json()

        const {contactId, groupsToUpdate } = body

        if (contactId) {

        const contact = await prisma.uPP_Contact.update({

            where: {
                id: contactId
            },

            data: {
                groups: {
                    connect: groupsToUpdate.groupsToAdd.map((group: Group )=> ({
                        id: group.id
                    })),
                    disconnect: groupsToUpdate.groupsToRemove.map((group : Group) => ({
                        id: group.id
                    }))
                }
            }
        })

        return NextResponse.json(contact)  
            
        }  else {
            throw new Error('No contact id provided')
        }

    } catch (error) {
        return NextResponse.json(error)
    }

}