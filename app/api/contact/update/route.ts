import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const maxDuration = 60
export const revalidate = 0

export async function PUT(req: NextRequest){

    try {
        
        const session = await getServerSession(authOptions)

        if (session) {

            const searchParams = req.nextUrl.searchParams
            const contactId = searchParams.get('contactId')

            const body = await req.json()

            const { nom, prenom, email, telephone } = body

            let updateData: any = {}

            if (nom) updateData.nom = nom
            if (prenom) updateData.prenom = prenom
            if (email) updateData.email = email
            if (telephone) updateData.telephone = telephone

            if (contactId) {

                const contact = await prisma.uPP_Contact.update({
                    where:{
                        id: contactId
                    },
                    data: updateData,
                })

                return NextResponse.json(contact)

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