import { NextRequest, NextResponse } from 'next/server'

import prisma from "@/lib/prisma"

export const maxDuration = 300
export const revalidate = 0

export async function GET(req: NextRequest){

    try {      

        const searchParams = req.nextUrl.searchParams
        const contactId = searchParams.get('contactId')
        const contactEmail = searchParams.get('contactEmail')

        if (contactId) {

            const contact = await prisma.uPP_Contact.findUnique({
                where: {
                    id: contactId,
                },
                include: {
                    groups: true
                }
            })

            return NextResponse.json(contact)

        } else if (contactEmail) {

            const contact = await prisma.uPP_Contact.findUnique({
                where: {
                    email: contactEmail
                },
                include: {
                    groups: true
                }
            })

            return NextResponse.json(contact)

        } else {
            throw new Error('No contact email or contact id provided')
        }


    } catch (error) {
        return NextResponse.json(error)
    }

}