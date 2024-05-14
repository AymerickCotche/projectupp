import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

interface Group {
    id: string
    nom: string
    createdAt: string
    updatedAt: string
  }

export const maxDuration = 300
export const revalidate = 0

export async function POST(req: NextRequest){

    try {
        
        const session = await getServerSession(authOptions)

        if (session) {

            const body = await req.json()

            const { contactData } = body

            const {nom, prenom, email, telephone, groups } = contactData

            const contact = await prisma.uPP_Contact.create({
                data: {
                    nom,
                    prenom,
                    email,
                    telephone,
                    groups: {
                        connect: groups.map((group: Group) => ({id: group.id}))
                    }
                }
            })                

            return NextResponse.json(contact)

        } else {
            throw new Error('User not signed in')
        }

    } catch (error) {
        return NextResponse.json(error)
    }

}