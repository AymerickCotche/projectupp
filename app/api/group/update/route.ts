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
            const grouplistId = searchParams.get('grouplistId')

            const body = await req.json()

            const { nom } = body

            let updateData: any = {}

            if (nom) updateData.nom = nom

            if (grouplistId) {

                const group = await prisma.uPP_Grouplist.update({
                    where:{
                        id: grouplistId
                    },
                    data: updateData,
                })

                return NextResponse.json(group)

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