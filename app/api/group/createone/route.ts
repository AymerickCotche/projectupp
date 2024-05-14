import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const maxDuration = 60
export const revalidate = 0

export async function POST(req: NextRequest){

    try {
        
        const session = await getServerSession(authOptions)

        if (session) {

            const body = await req.json()

            const { groupData } = body

            const { nom } = groupData

            const group = await prisma.uPP_Grouplist.create({
                data: {
                    nom
                }
            })                

            return NextResponse.json(group)

        } else {
            throw new Error('User not signed in')
        }

    } catch (error) {
        return NextResponse.json(error)
    }

}