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
            const campaignId = searchParams.get('campaignId')

            const body = await req.json()

            const { nom, description, date, campaignGroups } = body

            let updateData: any = {}

            if (nom) updateData.nom = nom
            if (description) updateData.description = description
            if (date) updateData.date = date
            if (campaignGroups) updateData.groups = campaignGroups

            if (campaignId) {

                const campaign = await prisma.uPP_Campaign.update({
                    where:{
                        id: campaignId
                    },
                    data: {
                        nom
                    },
                })

                return NextResponse.json(campaign)

            }  else {
                throw new Error('No campaign id provided')
            }

        } else {
            throw new Error('User not signed in')
        }

    } catch (error) {
        return NextResponse.json(error)
    }

}